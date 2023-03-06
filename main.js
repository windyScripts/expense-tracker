const form = document.querySelector('#form');

form.addEventListener('submit',validateAndSubmitForm)

async function validateAndSubmitForm(e){
    if(!form.checkValidity()) {
        e.preventDefault();
    }
    form.classList.add('was-validated');
    const response = await axios.post('http://localhost:3000',1);
    console.log(reponse);
}