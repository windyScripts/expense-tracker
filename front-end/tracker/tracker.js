const form = document.querySelector('#form');
const formSubmit = document.querySelector('#formSubmit');
const expenseName = document.querySelector('#expenseName');
const expensePrice = document.querySelector('#expensePrice');
const items = document.querySelector('#items');
const totalValue = document.querySelector('#totalValue');
const expenseCategory = document.querySelector('#expenseCategory')
const categories = document.querySelectorAll('.expenseCategory')
const premium = document.querySelector('#premium');
let totalPrice = 0;



async function createPaymentRequest(e){
e.preventDefault();
console.log("Button press logged");
const response = await axios.get('http://localhost:3000/purchase/createorder',{headers:{"Authorization": getToken()}})
let options = {
    key:response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
        const transactionResponse = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{ // !!!!!!
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
            payment_status: "SUCCESS"
        }, {headers:{'Authorization':getToken()}})

        //console.log("!!!!",transactionResponse.data.token,"!!!!");
        localStorage.setItem('token',transactionResponse.data.token)
        premium.classList.add('disabled','btn-warning');
        premium.classList.remove('btn-success')
        premium.textContent = "You are a premium user!"

        alert('You are a premium user now.')
    }
}
const rzpl = new Razorpay(options);
rzpl.open();
e.preventDefault();
rzpl.on('payment.failed', async function(response){
    console.log(response);
    alert('Something went wrong')
    await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{ // !!!!!!
    order_id: options.order_id,
    payment_id: response.razorpay_payment_id,
    payment_status: "FAILURE"
}, {headers:{'Authorization':getToken()}})
})

}

// Event listeners

// add entry listener

formSubmit.addEventListener('click',addEntry);

// show entries on window load listener

window.addEventListener('DOMContentLoaded',onDOMContentLoad);

// delete entry listener

items.addEventListener('click',deleteEntry);

// edit entry listener

items.addEventListener('click',editEntry);

// add premium features

premium.addEventListener('click', createPaymentRequest);

// edit entry

async function editEntry(e){
    try{
        if(e.target.classList.contains('edit')){
        let row = e.target.parentNode.parentNode;
        let name = row.firstChild.textContent;
        let price = row.firstChild.nextSibling.textContent;
        let category = row.firstChild.nextSibling.nextSibling.textContent;
        let id = row.id;
        let categoryValue ='0';
        // console.log(categories[0].innerText);
        categories.forEach(e=>{
            if(e.innerText===category){
                categoryValue = e.value;
            }
        })

    //    console.log(name,price,category,categoryValue,id);
        const message = await axios.delete("http://localhost:3000/entry/"+id,{headers: {'Authorization':token}})
        console.log(message);
        expenseName.value = name;
        expensePrice.value = price;
        expenseCategory.value = categoryValue;
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
                let message = await axios.delete("http://localhost:3000/entry/"+id,{headers: {'Authorization':token}})
                console.log(message);
                    let price = row.firstChild.nextSibling.textContent;
                    totalPrice -= price;
                    updatePrice()
                    items.removeChild(row);
        }
    }} catch(err) {console.log(err);}
}

// display Products and total value.

async function onDOMContentLoad(e){
try{totalPrice = 0;
let token = getToken(); //token works. Have to set header.
let message = await axios.get("http://localhost:3000/entries", {headers: {'Authorization':token}}) // ?
console.log(message);
let arrayOfProducts = message.data.products;

const premiumStatus = message.data.premiumStatus;
if(premiumStatus){
    premium.classList.add('disabled','btn-warning');
    premium.classList.remove('btn-success')
    premium.textContent = "You are a premium user!"
    const inputElement = document.createElement('input');
    inputElement.type = 'button';
    inputElement.value = 'Show Leaderboard';
    inputElement.onclick = async() => {
        const token = getToken();
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/leaderboard')
    }

}
//    console.log(arrayOfProducts);
//    console.log(totalValue.target)
    arrayOfProducts.forEach(element => {
        let newRow = createRow(element['name'],element['price'],element['category'],element['id']);
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
    let category =  expenseCategory.options[expenseCategory.value].text// 
    const token = getToken();
     console.log(token);
    let id;
    let entry = {
        name,
        price,
        category,
        token
    }
    console.log(entry);
    let message = await axios.post("http://localhost:3000/entry",entry,{headers: {'Authorization':token}});
        console.log(message);
        
        // add value

        id = message.data.id;
        // console.log(id);
        let newRow = createRow(name,price,category,id);
        items.appendChild(newRow);

        // update price

        totalPrice += parseInt(price);
        updatePrice()
        // empty fields

        expenseName.value='';
        expensePrice.value='';
        expenseCategory.value='1';

    }catch(err) {console.log(err);}} 

// create table row from name, price with id.

function createRow(name,price,category,id){
let row = document.createElement('tr');
row.className = 'item';

let nameData = document.createElement('td');
nameData.appendChild(document.createTextNode(name));

let priceData = document.createElement('td');
priceData.appendChild(document.createTextNode(price));

let categoryData = document.createElement('td');
categoryData.appendChild(document.createTextNode(category));

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
row.appendChild(categoryData);
row.appendChild(editTab);
row.appendChild(deleteTab);
return row;
}

// update price

function updatePrice(){
    totalValue.textContent= "TOTAL VALUE: "+totalPrice;
}

function getToken(){
    try{
        return token = localStorage.getItem('token')
    } catch(err) {
        console.log(err);
    }
}
