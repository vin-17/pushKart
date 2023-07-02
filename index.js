import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"   //importing this to initialize firebase application
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-4c1a3-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)

const shoppingListInDB = ref(database, "shoppingList") //reference to new location in database

const inputFieldEl = document.getElementById("input-field") //input-field
const addButtonEl = document.getElementById("add-button") //add-button
const shoppingListEl = document.getElementById("shopping-list") //shop-list

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    //to push the input item into the database 
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

//sync data between client and database
onValue(shoppingListInDB, function(snapshot) {
    //there are items in the list
    if (snapshot.exists()) {
        //to turn the object into array
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl() //clear the stuff before updating data
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } //there are no items in the list
    else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

//clear the shopping list
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

//clear input field
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    //createElement
    let newEl = document.createElement("li")
    //provide inner text
    newEl.textContent = itemValue
    
    //remove the item which got clicked
    newEl.addEventListener("click", function() {
        
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        //deleted this location data from database
        remove(exactLocationOfItemInDB)
    })
    //placing it inside parent container
    shoppingListEl.append(newEl)
}