const form = document.querySelector('#form');
const emailField = document.querySelector('#email');
const passwordField = document.querySelector('#password');
const signUpButton = document.querySelector('#toSignUp');
const feedback = document.querySelector('#failMessage');
const forgotPasswordButton = document.querySelector('#toForgotEmail');

form.addEventListener('submit', validateLogin);

async function validateLogin(e) {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
  } else {
    // clearing previous error/success message
    feedback.textContent = '';

    const entry = {
      password: passwordField.value,
      email: emailField.value,
    };
    //console.log(entry);
    try {
      const response = await axios.post('http://localhost:3000/auth/login', entry);
      feedback.textContent = 'Login success!';
      //console.log(response,response.data,response.data.token)
      const token = response.data.token;
      localStorage.setItem('token', token);
      //console.log(localStorage.getItem('token'));
      window.location.href = '../tracker/tracker.html';
    } catch (err) {
      feedback.textContent = 'Login failed!';
    }
  }
}

signUpButton.addEventListener('click', signUpRedirect);

function signUpRedirect() {
  window.location.href = '../signup/main.html';
}

forgotPasswordButton.addEventListener('click', forgotPasswordRedirect);

function forgotPasswordRedirect() {
  window.location.href = '../forgot-password/forgot-password.html';
}
