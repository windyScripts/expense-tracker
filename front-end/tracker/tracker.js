

const form = document.querySelector('#form');

const formSubmit = document.querySelector('#formSubmit');

const expenseName = document.querySelector('#expenseName');
const expensePrice = document.querySelector('#expensePrice');
const totalValue = document.querySelector('#totalValue');
const expenseCategory = document.querySelector('#expenseCategory')
const categories = document.querySelectorAll('.expenseCategory')
const premium = document.querySelector('#premium');
/* const leaderboardTableBody = document.querySelector('#leaderboard')
const leaderboardTable = document.querySelector('#leaderboardTable') */
const logOutButton = document.querySelector('#logout')
/* const leaderboardButton = document.querySelector('#showLeaderboard'); */
const premiumFeatures = document.querySelector('#premiumFeature')
const pdfButton = document.querySelector('#pdfDownload')
const paginationButtons = document.querySelector('#pagination');
paginationButtons.addEventListener('click',changeExpensePage)
const expensesPerPageForm = document.querySelector('#expensesPerPageForm')

expensesPerPageForm.addEventListener('submit',changeDisplayNumber);

async function changeDisplayNumber(e){
    e.preventDefault();

    const newDisplayNumber = document.querySelector('#expensesPerPageSelect').value;
    console.log(newDisplayNumber);
    localStorage.setItem('displayNumber',newDisplayNumber);
    refreshDisplay(newDisplayNumber)

}

async function changeExpensePage(e){

if(e.target.id==='expensesBack' || e.target.id==='expensesForward'){

    const expenseContainer = document.querySelector('tbody#items')

const targetPageNumber = parseInt(e.target.textContent);

const expensesPerPage = getItemsPerPage();
console.log(expensesPerPage)

const relativePagePosition = e.target.id;

const id = (e.target.id==='expensesBack'?expenseContainer.firstElementChild.id:expenseContainer.lastElementChild.id)

const response = await axios.get('http://localhost:3000/entries/'+targetPageNumber,{headers:{"Authorization": getToken()},params: {items: expensesPerPage, relativePagePosition, id} })

const currentPageExpenses = response.data.currentPageExpenses;

const numberOfPages = response.data.numberOfPages;

// load expenses and change button configuration

displayEntriesFromArray(currentPageExpenses);

//console.log("!", numberOfPages, targetPageNumber);

configureButtons(numberOfPages, targetPageNumber);

}

}

pdfButton.addEventListener('click',getPDFLink);

async function getPDFLink(e){
    e.preventDefault();

    const startDate = document.querySelector('#startDate').value;

    const endDate = document.querySelector('#endDate').value;

    const response = await axios.get('http://localhost:3000/download',{headers:{"Authorization": getToken()}, params: { start_date: startDate, end_date: endDate }})

    if(response.status === 200){

    const a = document.createElement('a');
    a.href = response.data.fileUrl;
    a.download = 'myexpense.csv';
    console.log(response);
    a.click();
} 

else {
    throw new Error(response.data.message);
}
}

let totalPrice = 0;

logOutButton.addEventListener('click', logOutUser);

async function logOutUser(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    console.log("token removed!");
    window.location.href="../login/login.html"

}

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

        window.location.reload();
        
        
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

// functions related to entry listener

items.addEventListener('click',entryFunctions);


function entryFunctions(e){
    try{
        if(e.target.classList.contains('edit')){
            editEntry(e);
        }
        else if(e.target.classList.contains('delete')){
            deleteEntry(e);
        }
    }
    catch(err){
        console.log(err);
    }
}

// add premium features

premium.addEventListener('click', createPaymentRequest);

// edit entry

async function editEntry(e){
    try{
                let row = e.target.parentNode.parentNode;
        let date = row.children[0].innerText
        let name = row.children[1].innerText;
        let price = row.children[2].innerText;
        let category = row.children[3].innerText;
        let id = row.id;
        let categoryValue ='0';
        // console.log(categories[0].innerText);
        categories.forEach(e=>{
            if(e.innerText===category){
                categoryValue = e.value;
            }
        })

        console.log(name,price,category,categoryValue,id);
        expenseName.value = name;
        expensePrice.value = price;
        expenseCategory.value = categoryValue;
        formSubmit.removeEventListener('click',addEntry)
        formSubmit.addEventListener('click', patchExpense)
        async function patchExpense(e) {
            formSubmit.addEventListener('click',addEntry)
            formSubmit.removeEventListener('click', patchExpense)
            e.preventDefault();
            let name = expenseName.value;
            let price = expensePrice.value;
            let category =  expenseCategory.options[expenseCategory.value].text// 
            const token = getToken();
            let entry = {
                name,
                price,
                category,
            }
            const message = await axios.patch("http://localhost:3000/entry/"+id, entry,{headers: {'Authorization':token}})
            expenseName.value = '';
        expensePrice.value = '';
        expenseCategory.value = '0';
        }

        

        items.removeChild(row);
} catch(error) {console.log(error)}
}

// delete entry

async function deleteEntry(e){
    try{
            if(confirm('Are you sure?')){
                console.log(e.target.parentNode.parentNode);
                let row = e.target.parentNode.parentNode;
                let id = row.id;
                let message = await axios.delete("http://localhost:3000/entry/"+id,{headers: {'Authorization':token}})
                console.log(message);
                    items.removeChild(row);
        }
    } catch(err) {console.log(err);}
}


// display Products and total value.

async function onDOMContentLoad(e){

try{totalPrice = 0;

const expensesPerPage = getItemsPerPage();

refreshDisplay(expensesPerPage)

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

        id = message.data[0].id;
        const date = new Date(message.data[0].date);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1);
        if(month.length==1) month = '0'+month;
        const day = date.getDate();
        const dateString = `${year}-${month}-${day}`;
        // console.log(id);
        const items = document.querySelector('#items');
        createRow(dateString,name,price,category,id, items);
        

        // update price

        // empty fields

        expenseName.value='';
        expensePrice.value='';
        expenseCategory.value='1';

    }catch(err) {console.log(err);}} 

// configure pagination buttons

function configureButtons(numberOfPages, currentPage){

    const nextPageButton = document.querySelector('#expensesForward')

    if(currentPage >= numberOfPages){

    nextPageButton.setAttribute('disabled','');

    nextPageButton.innerText = '-';

} else {


nextPageButton.innerText = currentPage+1;

nextPageButton.disabled = false;

}
    
    const currentPageButton = document.querySelector('#currentExpenses')
    //currentPageButton.setAttribute('data-total-pages',numberOfPages);
    currentPageButton.setAttribute('disabled','');

    currentPageButton.innerText = currentPage;
    
    const previousPageButton = document.querySelector('#expensesBack')
    
    if(numberOfPages<2||currentPage===1){

    previousPageButton.setAttribute('disabled','')

    previousPageButton.innerText = '-';

    }
    else{
        //previousPageButton.setAttribute('data-total-pages',numberOfPages);
        previousPageButton.innerText = currentPage - 1;  
    
        previousPageButton.disabled = false;
    }

}

// create rows of data from an array

    function displayEntriesFromArray(arrayOfExpenses){
        const items = document.querySelector('#items');
        items.innerHTML = '';

        arrayOfExpenses.forEach(element => {
        
            

            

            createRow(element['date'],element['name'],element['price'],element['category'],element['id'],items);
                     

        });        
        }

// create table row from name, price with id.

function createRow(date,name,price,category,id,parent){

let row = document.createElement('tr');
row.className = 'item';

let dateData = document.createElement('td');
dateData.appendChild(document.createTextNode(date));

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

row.appendChild(dateData);
row.appendChild(nameData);
row.appendChild(priceData);
row.appendChild(categoryData);
row.appendChild(editTab);
row.appendChild(deleteTab);

while(parent.childElementCount>(getItemsPerPage()-1)){
    parent.removeChild(items.firstChild)
}

parent.appendChild(row);

}

function getItemsPerPage(){
    return localStorage.getItem('displayNumber')||document.querySelector('#expensesPerPageSelect').value;
}

function getToken(){
    try{
        return token = localStorage.getItem('token')
    } catch(err) {
        console.log(err);
    }
}

async function refreshDisplay(expensesPerPage){
    let token = getToken(); //token works. Have to set header.
    
    let message = await axios.get("http://localhost:3000/entries", {headers: {'Authorization':token},params: {items: expensesPerPage} }) // ?
    
    console.log(message);
    
    let arrayOfExpenses = message.data.currentPageExpenses;
    // Need to create buttons with the number of items, and create the offset for loading.
    
    const numberOfPages = message.data.numberOfPages;
    
    const startingPage = numberOfPages;

    console.log(numberOfPages,startingPage);
    
    configureButtons(numberOfPages,startingPage)

    const premiumStatus = message.data.premiumStatus;

if(premiumStatus===true){

    unlockPremium()

displayEntriesFromArray(arrayOfExpenses);

}

}

async function unlockPremium(){
    premium.classList.add('disabled','btn-warning');
  premium.classList.remove('btn-success')
  premium.textContent = "You are a premium user!"
  premiumFeatures.toggleAttribute('hidden');
  /* leaderboardButton.onclick = async() => {
      const token = getToken();
      leaderboardTable.toggleAttribute('hidden');
      if(leaderboardTable.hasAttribute('hidden')){
          document.querySelector('#showLeaderboard').value="Show Leaderboard";
          document.querySelector('#showLeaderboard').innerText="Show Leaderboard";
          leaderboardTableBody.innerHTML="";
      }
      else{
          document.querySelector('#showLeaderboard').value="Hide Leaderboard";
          document.querySelector('#showLeaderboard').innerText="Hide Leaderboard";
          const userLeaderBoardObject = await axios.get('http://localhost:3000/premium/leaderboard');
          console.log(userLeaderBoardObject.data);
          Object.keys(userLeaderBoardObject.data).forEach(e => {
              console.log(e);
              const row = document.createElement('tr');
              const nameData = document.createElement('td');
              const expenseData = document.createElement('td');
              nameData.appendChild(document.createTextNode(userLeaderBoardObject.data[e].name))
              expenseData.appendChild(document.createTextNode(userLeaderBoardObject.data[e].totalExpense))
              row.appendChild(nameData);
              row.appendChild(expenseData);
              leaderboardTableBody.appendChild(row);
          })
      }
} */
//console.log(inputElement);  
}