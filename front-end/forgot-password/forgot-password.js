const form = document.querySelector('#form');
const emailField = document.querySelector('#email');
const toLoginButton = document.querySelector('#toLogin')

form.addEventListener('onSubmit', onEmailSubmit);

toLoginButton.addEventListener('click',loginRedirect)

async function onEmailSubmit(e) {
    e.preventDefault();
    const email = emailField.value;
    console.log(email);
    const response = await axios.post('http://localhost:3000/password/forgotpassword',{email})
}

function loginRedirect(e){
    window.location.href="../login/login.html"
}