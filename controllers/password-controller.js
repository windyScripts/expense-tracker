const Sib = require('sib-api-v3-sdk')

require('dotenv').config();

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SIB_SMTP_API_KEY

exports.forgotPassword = async (req,res,next) => {
    try{
        const transactionalEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            name: 'Rubrik',
            email: 'arvnd2life+sendinblue@gmail.com'
        }
        //console.log({to:req.body.email});
        const receiver = [{email:req.body.email}];
        await transactionalEmailApi.sendTransacEmail({
            sender,
            to:receiver,
            subject: 'Reset password for your account',
            textContent: 'This is my message',
            htmlContent:`
            <h1>Reset Password</h1>
            <p>please use the following link to reset your password: {{params.passwordURL}} </p>
            `,
            params: {
                passwordURL: 'example.com/exampleendpoint'
            }
        })
        console.log("Messsage sent successfully");
    }
    catch(err){
        console.log(err); 
    }
}