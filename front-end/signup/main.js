const form = document.querySelector('#form');
const feedback = document.querySelector('#feedback')

// login details

const userNameField = document.querySelector('#name');
const emailField = document.querySelector('#email');
const passwordField = document.querySelector('#password');
const fail = document.querySelector('#failMessage');

form.addEventListener('submit',validateAndSubmitForm);

// frontend validation and handling response

async function validateAndSubmitForm(e){
    e.preventDefault();
    try{
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
    userNameField.value = '';
    passwordField.value = '';
    emailField.value = '';
    feedback.textContent="Success!";
    setTimeout(() => {
        feedback.textContent = '';
    }, 2000);
    }
    }
    catch(err){
        console.log(err);
    }
}
