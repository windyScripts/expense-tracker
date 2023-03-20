const Expenses = require('../models/expenses-model')
const User = require('../models/user-model')

exports.getExpenses = async (req,res,next) => {
   try {
    const products = await Expenses.findAll({where:{userDetailId:req.user.id}})
    console.log(products);
    const user = await User.findOne({where:{id:req.user.id}});
    const premiumStatus = user.ispremiumuser;
    console.log(premiumStatus);
    res.status(200).json({
        premiumStatus,
        products
    });
}
   catch(err) {
    console.log(err);
   }
}

exports.addExpense = async (req,res,next) => {
    try { console.log(req.body,req.user);
        const response = await Expenses.create({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            userDetailId: req.user.id
        });
        res.status(200).json(response);
    }
    catch(err) {
     console.log(err);
    }
}

exports.deleteExpense = async (req,res,next) => {
    try {
        const id = req.params.eId;
        const message = await Expenses.destroy({where : {id:id,userDetailId:req.user.id}});
        res.status(200).json(message);
    }
    catch(err) {
     console.log(err);
    }
}

exports.updateUserTotalExpense = async (req,res,next) => {
    try{
        //console.log("!!!!!!",req.user.id,req.body);
        const user = req.user;
        const response = await User.update({
            totalExpense: req.body.totalPrice
        },
        {
            where: {id: user.id}
        })
        res.status(200).json(response);

    }
    catch(err) {

    }
}