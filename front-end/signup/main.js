const form = document.querySelector('#form');

// login details
const userNameField = document.querySelector('#name');
const emailField = document.querySelector('#email');
const passwordField = document.querySelector('#password');
const fail = document.querySelector('#failMessage');

form.addEventListener('submit',validateAndSubmitForm)

async function validateAndSubmitForm(e){
    e.preventDefault();
    if(!form.checkValidity()) {
            form.classList.add('was-validated');
    }
    else {
        let entry = {
            userName:userNameField.value,
            password:passwordField.value,
            email:emailField.value
        }
        //console.log(entry);
    const response = await axios.post('http://localhost:3000/auth/new',entry);
    if(response.hasOwnProperty(failMessage)){
        feedback.textContent=response.failMessage;
    }
    else if(response.hasOwnProperty(successMessage)){
        feedback.textContent=response.successMessage;
    }
    console.log(response);
    }
}