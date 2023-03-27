const Sib = require('sib-api-v3-sdk');
const { v4 :uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/user-model')
const PasswordRequests = require('../models/password-requests-model');

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
        
        const receiver = [{email:req.body.email}];
        
        const reqId = uuidv4();
        const user = await User.findOne({where:{email:req.body.email}})
        //console.log(reqId)
        if(user){
        await PasswordRequests.create({
            userId: user.id,
            isActive: true,
            id: reqId
        })
        // On clicking this link the user should be redirected to a new window where they can update their password.
        const response = await transactionalEmailApi.sendTransacEmail({
            sender,
            to:receiver,
            subject: 'Reset password for your account',
            textContent: 'This is my message',
            htmlContent:`
            <h1>Reset Password</h1>
            <p>please use the following link to reset your password: {{params.passwordURL}} </p>
            `,
            params: {
                passwordURL: 'http://localhost:3000/password/resetpassword/'+reqId
            }
        })
        console.log("Messsage sent successfully");
        res.status(200).json({message:"Email sent successfully"})

    }
    else throw new Error('That email does not exist in records');
    }
    catch(err){
        console.log(err); 
    }
}

exports.getPasswordUpdateForm = async (req,res,next) => {
    try{
        const id= req.params.reqId;
        const req = PasswordRequests.findOne({where: {id:id}})
        console.log(req);
        if(req&&req.isActive) 
        {return res.status(200).send(`<html>
        <script>
            function formsubmitted(e){
                e.preventDefault();
                console.log('called')
            }
        </script>
        <form action="/password/updatepassword/${id}" method="get">
            <label for="newpassword">Enter New password</label>
            <input name="newpassword" type="password" required></input>
            <button>reset password</button>
        </form>
    </html>`
    )
    }

    else throw new Error('Reset link expired/invalid');
    }
    catch(err){
        console.log(err);
    }
}

exports.setPassword = async (req,res,next) => {
    try {
        // store password, make isActive for request false.
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        const passwordRequest = await PasswordRequests.findOne({where:{
            id:resetpasswordid
        }})
        const user = await User.findOne({where:{
            id:passwordRequest.userId
        }})
        if(user){
            bcrypt.hash(newpassword,10,(err,hash)=>{
                p1 = user.update({password:hash});
                p2 = passwordRequest.update({isActive:false});
                Promise.all([p1,p2]).then(result => {
                    res.status(201).json({message:"Successfully updated new password"});
                })
            })
        }
        else return res.status(404).json({error:'No user Exists',success:false})
    }
    catch(err){
        return res.status(403).json({ error, success: false } )
    }
}