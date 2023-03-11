const User = require('../models/user-details')

exports.addUser = async (req,res,next) => {
    try{
        console.log(req.body,"!!!");
        const response = await User.create({
            name: req.body.userName,
            email: req.body.email,
            password: req.body.password
        });
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
}