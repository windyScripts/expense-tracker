const Expenses = require('../models/expenses-model')
const User = require('../models/user-model')
const sequelize = require('../util/database');


exports.getExpenses = async (req,res,next) => {
   try {
    const products = await Expenses.findAll({where:{userId:req.user.id}})
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
        const t = await sequelize.transaction();
        const expenseCreationPromise = Expenses.create({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            userId: req.user.id,
            transaction: t
        });
        const updatedExpense = Number(req.user.totalExpense) + Number(req.body.price);
        const userTotalExpenseUpdationPromise = User.update({
            totalExpense: updatedExpense,
            transaction: t
        },
        {
            where: {id: req.user.id}
        })
        const message = await Promise.all([expenseCreationPromise,userTotalExpenseUpdationPromise])
        await t.commit();
        res.status(200).json(message);
    }
    catch(err) {
     console.log(err);
     await t.rollback();
    }
}

exports.deleteExpense = async (req,res,next) => {
    try {
        const t = await sequelize.transaction();
        const id = req.params.eId;
        const expense = await Expenses.findOne({where : {id:id,userId:req.user.id}})
        const updatedExpense = Number(req.user.totalExpense)- Number(expense.price)
        const userTotalExpenseUpdationPromise = User.update({
            totalExpense: updatedExpense,
            transaction: t
        },
        {
            where: {id: req.user.id}
        })
        const expenseDeletionPromise = Expenses.destroy({where : {id:id,userId:req.user.id}},{transaction:t});
        const message = await Promise.all([userTotalExpenseUpdationPromise,expenseDeletionPromise])
        await t.commit();
        res.status(200).json(message);
    }
    catch(err) {
     console.log(err);
     await t.rollback();
    }
}
