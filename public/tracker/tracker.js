const scheme = 'http';
const hostName = 'localhost';
const port = 3000;
const domain = `${scheme}://${hostName}:${port}`;

const formSubmit = document.querySelector('#formSubmit');

const expenseName = document.querySelector('#expenseName');
const expensePrice = document.querySelector('#expensePrice');
const expenseCategory = document.querySelector('#expenseCategory');
const categories = document.querySelectorAll('.expenseCategory');
const premium = document.querySelector('#premium');

const logOutButton = document.querySelector('#logout');

const premiumFeatures = document.querySelector('#premiumFeature');
const pdfButton = document.querySelector('#pdfDownload');
const paginationButtons = document.querySelector('#pagination');
paginationButtons.addEventListener('click', changeExpensePage);
const expensesPerPageForm = document.querySelector('#expensesPerPageForm');

expensesPerPageForm.addEventListener('submit', changeDisplayNumber);

async function changeDisplayNumber(e) {
  e.preventDefault();

  const newDisplayNumber = document.querySelector('#expensesPerPageSelect').value;
  console.log(newDisplayNumber);
  localStorage.setItem('displayNumber', newDisplayNumber);
  refreshDisplay(newDisplayNumber);
}

async function changeExpensePage(e) {
  if (e.target.id === 'expensesBack' || e.target.id === 'expensesForward') {
    const targetPageNumber = parseInt(e.target.textContent);

    const expensesPerPage = getNumberOfItemsPerPage();

    const response = await axios.get(domain + '/entries/' + targetPageNumber, { headers: { Authorization: getToken() }, params: { items: expensesPerPage }});

    const currentPageExpenses = response.data.currentPageExpenses;
    const numberOfPages = response.data.numberOfPages;

    // load expenses and change button configuration

    displayEntriesFromArray(currentPageExpenses);

    configureButtons(numberOfPages, targetPageNumber);
  }
}

pdfButton.addEventListener('click', getPDFLink);

async function getPDFLink(e) {
  e.preventDefault();

  const startDate = document.querySelector('#startDate').value;

  const endDate = document.querySelector('#endDate').value;

  const response = await axios.get(domain + '/download', { headers: { Authorization: getToken() }, params: { start_date: startDate, end_date: endDate }});

  if (response.status === 200) {
    const a = document.createElement('a');
    a.href = response.data.fileUrl;
    a.download = 'myexpense.csv';
    console.log(response);
    a.click();
  } else {
    throw new Error(response.data.message);
  }
}

logOutButton.addEventListener('click', logOutUser);

async function logOutUser(e) {
  e.preventDefault();
  localStorage.removeItem('token');
  console.log('token removed!');
  window.location.href = '../login/login.html';
}

async function createPaymentRequest(e) {
  e.preventDefault();
  const response = await axios.get(domain + '/purchase/createorder', { headers: { Authorization: getToken() }});
  const options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    async handler (response) {
      const transactionResponse = await axios.post(domain + '/purchase/updatetransactionstatus', { // !!!!!!
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
        payment_status: 'SUCCESS',
      }, { headers: { Authorization: getToken() }});

      localStorage.setItem('token', transactionResponse.data.token);

      window.location.reload();
    },
  };
  const rzpl = new Razorpay(options);
  rzpl.open();
  e.preventDefault();
  rzpl.on('payment.failed', async function(response) {
    alert('Something went wrong');
    await axios.post(domain + '/purchase/updatetransactionstatus', { // !!!!!!
      order_id: options.order_id,
      payment_id: response.razorpay_payment_id,
      payment_status: 'FAILURE',
    }, { headers: { Authorization: getToken() }});
  });
}

// Event listeners

formSubmit.addEventListener('click', addEntry);

window.addEventListener('DOMContentLoaded', refreshEntries);

const items = document.querySelector('#items');
items.addEventListener('click', entryFunctions);

premium.addEventListener('click', createPaymentRequest);

function entryFunctions(e) {
  try {
    if (e.target.classList.contains('edit')) {
      editEntry(e);
    } else if (e.target.classList.contains('delete')) {
      deleteEntry(e);
    }
  } catch (err) {
    console.log(err);
  }
}

// edit entry

async function editEntry(e) {
  try {
    const row = e.target.parentNode.parentNode;
    const name = row.children[1].innerText;
    const price = row.children[2].innerText;
    const category = row.children[3].innerText;
    const id = row.id;
    formSubmit.setAttribute('data-id', id);
    let categoryValue = '0';
    categories.forEach(e => {
      if (e.innerText === category) {
        categoryValue = e.value;
      }
    });

    expenseName.value = name;
    expensePrice.value = price;
    expenseCategory.value = categoryValue;

    items.removeChild(row);
  } catch (error) {
    console.log(error);
  }
}

// delete entry

async function deleteEntry(e) {
  try {
    if (confirm('Are you sure?')) {
      console.log(e.target.parentNode.parentNode);
      const row = e.target.parentNode.parentNode;
      const id = row.id;
      const message = await axios.delete(domain + '/entry/' + id, { headers: { Authorization: token }});
      console.log(message);
      items.removeChild(row);
    }
  } catch (err) {
    console.log(err);
  }
}

// display Products and total value.

async function refreshEntries() {
  try {
    const expensesPerPage = getNumberOfItemsPerPage();

    refreshDisplay(expensesPerPage);
  } catch (err) {
    console.log(err);
  }
}

// add an entry and update total price.

async function addEntry(e) {
  try {
    e.preventDefault();
    const name = expenseName.value;
    const price = expensePrice.value;
    const category =  expenseCategory.options[expenseCategory.value].text;//
    const token = getToken();
    const id = formSubmit.getAttribute('data-id');
    const entry = {
      id,
      name,
      price,
      category,
      token,
    };
    await axios.post(domain + '/entry', entry, { headers: { Authorization: token }});

    // add value

    refreshEntries();

    // empty fields

    expenseName.value = '';
    expensePrice.value = '';
    expenseCategory.value = '1';
  } catch (err) {
    console.log(err);
  }
}

// configure pagination buttons

function configureButtons(numberOfPages, currentPage) {
  const nextPageButton = document.querySelector('#expensesForward');

  if (currentPage >= numberOfPages) {
    nextPageButton.setAttribute('disabled', '');

    nextPageButton.innerText = '-';
  } else {
    nextPageButton.innerText = currentPage + 1;

    nextPageButton.disabled = false;
  }

  const currentPageButton = document.querySelector('#currentExpenses');
  currentPageButton.setAttribute('disabled', '');

  currentPageButton.innerText = currentPage;

  const previousPageButton = document.querySelector('#expensesBack');

  if (numberOfPages < 2 || currentPage === 1) {
    previousPageButton.setAttribute('disabled', '');

    previousPageButton.innerText = '-';
  } else {
    previousPageButton.innerText = currentPage - 1;

    previousPageButton.disabled = false;
  }
}

// create rows of data from an array

function displayEntriesFromArray(arrayOfExpenses) {
  const items = document.querySelector('#items');
  items.innerHTML = '';

  arrayOfExpenses.forEach(element => {
    createRow(element['date'], element['name'], element['price'], element['category'], element['id'], items);
  });
}

// create table row from name, price with id.

function createRow(date, name, price, category, id, parent) {
  const row = document.createElement('tr');
  row.className = 'item';

  const dateData = document.createElement('td');
  dateData.appendChild(document.createTextNode(date));

  const nameData = document.createElement('td');
  nameData.appendChild(document.createTextNode(name));

  const priceData = document.createElement('td');
  priceData.appendChild(document.createTextNode(price));

  const categoryData = document.createElement('td');
  categoryData.appendChild(document.createTextNode(category));

  const editButton = document.createElement('button');
  editButton.className = 'btn btn-success edit';
  editButton.appendChild(document.createTextNode('edit'));
  const editTab = document.createElement('td');
  editTab.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-danger delete';
  deleteButton.appendChild(document.createTextNode('delete'));
  const deleteTab = document.createElement('td');
  deleteTab.appendChild(deleteButton);

  row.id = id;

  row.appendChild(dateData);
  row.appendChild(nameData);
  row.appendChild(priceData);
  row.appendChild(categoryData);
  row.appendChild(editTab);
  row.appendChild(deleteTab);

  while (parent.childElementCount > (getNumberOfItemsPerPage() - 1)) {
    parent.removeChild(items.firstChild);
  }

  parent.appendChild(row);
}

function getNumberOfItemsPerPage() {
  return localStorage.getItem('displayNumber') || document.querySelector('#expensesPerPageSelect').value;
}

function getToken() {
  try {
    return token = localStorage.getItem('token');
  } catch (err) {
    console.log(err);
  }
}

async function refreshDisplay(expensesPerPage) {
  const token = getToken(); //token works. Have to set header.

  const message = await axios.get(domain + '/entries', { headers: { Authorization: token }, params: { items: expensesPerPage }}); // ?

  const arrayOfExpenses = message.data.currentPageExpenses;

  const numberOfPages = message.data.numberOfPages;
  const startingPage = numberOfPages;

  configureButtons(numberOfPages, startingPage);

  const premiumStatus = message.data.premiumStatus;
  if (premiumStatus === true) {
    unlockPremium();

    displayEntriesFromArray(arrayOfExpenses);
  }
}

async function unlockPremium() {
  changePremiumButton();

  const leaderboardButton = document.querySelector('#showLeaderboard');
  leaderboardButton.addEventListener('click', enableLeaderboard);
}

function changePremiumButton() {
  premium.classList.add('disabled', 'btn-warning');
  premium.classList.remove('btn-success');
  premium.textContent = 'You are a premium user!';
  premiumFeatures.toggleAttribute('hidden');
}

async function enableLeaderboard() {
  const leaderboardTableBody = document.querySelector('#leaderboard');
  const leaderboardTable = document.querySelector('#leaderboardTable');

  const token = getToken();

  leaderboardTable.toggleAttribute('hidden');

  if (leaderboardTable.hasAttribute('hidden')) {
    document.querySelector('#showLeaderboard').value = 'Show Leaderboard';

    document.querySelector('#showLeaderboard').innerText = 'Show Leaderboard';

    leaderboardTableBody.innerHTML = '';
  } else {
    document.querySelector('#showLeaderboard').value = 'Hide Leaderboard';

    document.querySelector('#showLeaderboard').innerText = 'Hide Leaderboard';

    const userLeaderBoardObject = await axios.get(domain + '/leaderboard', { headers: { Authorization: token }});

    console.log(userLeaderBoardObject.data);

    Object.keys(userLeaderBoardObject.data).forEach(e => {
      const row = document.createElement('tr');

      const nameData = document.createElement('td');

      const expenseData = document.createElement('td');

      nameData.appendChild(document.createTextNode(userLeaderBoardObject.data[e].name));

      expenseData.appendChild(document.createTextNode(userLeaderBoardObject.data[e].totalExpense));

      row.appendChild(nameData);

      row.appendChild(expenseData);

      leaderboardTableBody.appendChild(row);
    });
  }
}
