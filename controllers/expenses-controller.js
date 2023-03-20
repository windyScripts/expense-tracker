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
    try { //console.log(req.body,req.user);
        const expenseCreationPromise = Expenses.create({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            userDetailId: req.user.id
        });
        const updatedExpense = Number(req.user.totalExpense) + Number(req.body.price);
        const userTotalExpenseUpdationPromise = User.update({
            totalExpense: updatedExpense
        },
        {
            where: {id: req.user.id}
        })
        const message = Promise.all([expenseCreationPromise,userTotalExpenseUpdationPromise])
        res.status(200).json(message);
    }
    catch(err) {
     console.log(err);
    }
}

exports.deleteExpense = async (req,res,next) => {
    try {
        const id = req.params.eId;
        const expense = await Expenses.findOne({where : {id:id,userDetailId:req.user.id}})
        const updatedExpense = Number(req.user.totalExpense)- Number(expense.price)
        const userTotalExpenseUpdationPromise = User.update({
            totalExpense: updatedExpense
        },
        {
            where: {id: req.user.id}
        })
        const expenseDeletionPromise = Expenses.destroy({where : {id:id,userDetailId:req.user.id}});
        const message = await Promise.all([userTotalExpenseUpdationPromise,expenseDeletionPromise])
        res.status(200).json(message);
    }
    catch(err) {
     console.log(err);
    }
}