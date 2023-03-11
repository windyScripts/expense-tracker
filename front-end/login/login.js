const form = document.querySelector("#form");
const emailField = document.querySelector("#email");
const passwordField = document.querySelector("#password");
const signUpButton = document.querySelector('#toSignUp');
const feedback = document.querySelector('#failMessage');

form.addEventListener('submit',validateLogin)

async function validateLogin(e){
    e.preventDefault();
    if(!form.checkValidity()) {
            form.classList.add('was-validated');
    }
    else {
        let entry = {
            password:passwordField.value,
            email:emailField.value
        }
        //console.log(entry);
    const response = await axios.post('http://localhost:3000/auth/login',entry);
    if(response.hasOwnProperty(failMessage)){
        feedback.textContent=response.failMessage;
    }
    else if(response.hasOwnProperty(successMessage)){
        feedback.textContent=response.successMessage;
    }
    console.log(response);
    }
}