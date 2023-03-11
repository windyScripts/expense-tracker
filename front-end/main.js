const form = document.querySelector('#form');

// login details
const userNameField = document.querySelector('#name');
const emailField = document.querySelector('#email');
const passwordField = document.querySelector('#password');

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
    const response = await axios.post('http://localhost:3000/auth',entry);
    console.log(response);
    }
}