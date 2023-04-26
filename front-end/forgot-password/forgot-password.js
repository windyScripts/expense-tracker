const form = document.querySelector('#form');
const emailField = document.querySelector('#email');
const toLoginButton = document.querySelector('#toLogin')

form.addEventListener('submit', onEmailSubmit);

toLoginButton.addEventListener('click',loginRedirect)

async function onEmailSubmit(e) {
    e.preventDefault();
    if(!form.checkValidity()) {
            form.classList.add('was-validated');
    }
    else{
        const email = emailField.value;
        const response = await axios.post('http://localhost:3000/password/forgotpassword',{email})
        if(response.status===200){
            const emailValidFeedback = document.querySelector('#feedback')
            emailValidFeedback.textContent = "Request submitted."
        }
        
    }
}

function loginRedirect(e){
    window.location.href="../login/login.html"
}