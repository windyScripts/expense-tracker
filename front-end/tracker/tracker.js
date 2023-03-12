let form = document.querySelector('#form');
let formSubmit = document.querySelector('#formSubmit');
let expenseName = document.querySelector('#expenseName');
let expensePrice = document.querySelector('#expensePrice');
let items = document.querySelector('#items');
let totalValue = document.querySelector('#totalValue');
let totalPrice = 0;

// Event listeners

// add entry listener

formSubmit.addEventListener('click',addEntry);

// show entries on window load listener

window.addEventListener('DOMContentLoaded',displayProducts);

// delete entry listener

items.addEventListener('click',deleteEntry);

// edit entry listener

items.addEventListener('click',editEntry);

// edit entry

async function editEntry(e){
    try{
        if(e.target.classList.contains('edit')){
        let row = e.target.parentNode.parentNode;
        let name = row.firstChild.textContent;
        let price = row.firstChild.nextSibling.textContent;
        let id = row.id;
        console.log(name,price,id);
        const message = await axios.delete("http://localhost:3000/entry/"+id)
        console.log(message);
        expenseName.value = name;
        expensePrice.value = price;
        totalPrice -= price;
        updatePrice();
        items.removeChild(row);
}} catch(error) {console.log(error)}
}

// delete entry

async function deleteEntry(e){
    try{
        if(e.target.classList.contains('delete')){
            if(confirm('Are you sure?')){
                console.log(e.target.parentNode.parentNode);
                let row = e.target.parentNode.parentNode;
                let id = row.id;
                let message = await axios.delete("http://localhost:3000/entry/"+id)
                console.log(message);
                    let price = row.firstChild.nextSibling.textContent;
                    totalPrice -= price;
                    updatePrice()
                    items.removeChild(row);
        }
    }} catch(err) {console.log(err);}
}

// display Products and total value.

async function displayProducts(e){
try{totalPrice = 0;
let message = await axios.get("http://localhost:3000/entries")
console.log(message);
let arrayOfProducts = message.data;
    console.log(arrayOfProducts);
    console.log(totalValue.target)
    arrayOfProducts.forEach(element => {
        let newRow = createRow(element['name'],element['price'],element['id']);
        items.appendChild(newRow);  
        totalPrice+=parseInt(element['price']); 
          
    });

updatePrice()
} catch(err) {console.log(err);}
}

// add an entry and update total price.

async function addEntry(e){
    try{e.preventDefault();
    let name = expenseName.value;
    let price = expensePrice.value;
    console.log(typeof price);
    let id;
    let entry = {
        name,
        price
    }
    //console.log(entry);
    let message = await axios.post("http://localhost:3000/entry",entry);
        console.log(message);
        
        // add value

        id = message.data.id;
        console.log(id);
        let newRow = createRow(name,price,id);
        items.appendChild(newRow);

        // update price

        totalPrice += parseInt(price);
        updatePrice()
        // empty fields

        expenseName.value='';
        expensePrice.value='';

    }catch(err) {console.log(err);}} 

// create table row from name, price with id.

function createRow(name,price,id){
let row = document.createElement('tr');
row.className = 'item';

let nameData = document.createElement('td');
nameData.appendChild(document.createTextNode(name));

let priceData = document.createElement('td');
priceData.appendChild(document.createTextNode(price));

let editButton = document.createElement('button');
editButton.className = "btn btn-success edit";
editButton.appendChild(document.createTextNode('edit'));
let editTab = document.createElement('td');
editTab.appendChild(editButton);

let deleteButton = document.createElement('button');
deleteButton.className = "btn btn-danger delete";
deleteButton.appendChild(document.createTextNode('delete'));
let deleteTab = document.createElement('td');
deleteTab.appendChild(deleteButton);

row.id = id;
row.appendChild(nameData);
row.appendChild(priceData);
row.appendChild(editTab);
row.appendChild(deleteTab);
return row;
}

// update price

function updatePrice(){
    totalValue.textContent= "TOTAL VALUE: "+totalPrice;
}
