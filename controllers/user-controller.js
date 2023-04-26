const User = require('../models/user-model')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

function generateAccessToken(id) {
    let iat = new Date;
    return jwt.sign({userId: id, date:iat.getTime()},'12345')
}

function invalid(...params){
    //console.log("XZFSEAFASFSF",[...arguments],params)
    for(let i = 0; i < params.length; i++){
        console.log(params[i]);
        if(params[i].length<1||params[i]==undefined) return true; 
    }
    return false
}

// New user registration

exports.addUser = async (req,res,next) => {
    try{
        //console.log(req.body,"!!!!!ZZZZZZZZZZ");
        const check = invalid(req.body.userName,req.body.email,req.body.password);
        console.log(check);
        if(check) {
            return res.status(401).json({message:"Missing details."})
        }
        const saltRounds = 10;
        const password = await bcrypt.hash(req.body.password,saltRounds, async (err,hash)=>{
            const response = await User.create({
                name: req.body.userName,
                email: req.body.email,
                password: hash,
            });
            console.log(response);
            return res.status(200).json(response);
        })

    }
    catch(err){
        console.log(err);
    }
}

// login

exports.login = async (req,res,next) => {
    try{//console.log(req.body);
        const user = await User.findOne({where:{email:req.body.email}});
        if(user!==null){
            console.log(user)
            bcrypt.compare(req.body.password, user.password, (err,result)=>{
                if(result===true){
                    res.status(200).json({message:"Login successful",token:generateAccessToken(user.id)});
                }
                else if(err){
                    throw new Error('Something went wrong');
                }
                else res.status(401).json({message:"Invalid password"})

            })
        }
        else res.status(404).json({message:"No such user exists"})
    }
    catch(err) {
        console.log(err);
    }
}

