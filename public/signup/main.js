const scheme = 'http';
const hostName = '3.25.252.124';
const port = 3000;
const domain = `${scheme}://${hostName}:${port}`;

const form = document.querySelector('#form');
const feedback = document.querySelector('#feedback');

// login details

const userNameField = document.querySelector('#name');
const emailField = document.querySelector('#email');
const passwordField = document.querySelector('#password');

// login redirect

const toLoginButton = document.querySelector('#toLogin');
toLoginButton.addEventListener('click', loginRedirect);

function loginRedirect() {
  window.location.href = '../login/login.html';
}

// frontend validation and handling response

form.addEventListener('submit', validateAndSubmitForm);

async function validateAndSubmitForm(e) {
  e.preventDefault();
  try {
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
    } else {
      const entry = {
        userName: userNameField.value,
        password: passwordField.value,
        email: emailField.value,
      };
      //console.log(entry);
      const response = await axios.post(domain + '/auth/new', entry);
      userNameField.value = '';
      passwordField.value = '';
      emailField.value = '';
      feedback.textContent = 'Success!';
    }
  } catch (err) {
    console.log(err);
  }
}
