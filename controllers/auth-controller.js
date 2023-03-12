const User = require('../models/user-details')

function invalid(params){
    for(param of params){
        if(param.length<1||param==undefined) return true; 
    }
    return false
}

exports.addUser = async (req,res,next) => {
    try{
        // console.log(req.body,"!!!");
        if(invalid([req.body.userName,req.body.email,req.body.password])) {
            res.status(401).json({message:"Missing details."})
        }
        const response = await User.create({
            name: req.body.userName,
            email: req.body.email,
            password: req.body.password,
        });
        response.message = "Details valid";
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.send({message:err});
    }
}

exports.login = async (req,res,next) => {
    try{console.log(req.body);
        const user = await User.findOne({where:{email:req.body.email}});
        if(user){
            console.log(user)
            if(user.password === req.body.password){
                res.status(200).json({message:"Login successful"});
            }
            else res.status(401).json({message:"Invalid password"})
        }
        else res.status(404).json({message:"No such user exists"})
    }
    catch(err) {
        console.log(err);
    }
}