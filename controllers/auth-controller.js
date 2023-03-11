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
            throw("Missing parameter")
        }
        const response = await User.create({
            name: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            successMessage:"Details valid"
        });
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.send({failMessage:err});
    }
}

exports.login = async (req,res,next) => {
    try{console.log(req.body);
        if(User.findOne({where: {email:req.body.email}})){
            const user = await User.findOne({where:{email:req.body.email}});
            console.log(user.password, req.body.password)
            if(user.password = req.body.password){
                res.status(200).json({successMessage:"Login successful"});
            }
            else throw([401,"Invalid password"])
        }
        else throw([404,"No such user exists"])
    }
    catch(err) {
        console.log(err);
        res.status(err[0]).json({failMessage:err[1]});
    }
}