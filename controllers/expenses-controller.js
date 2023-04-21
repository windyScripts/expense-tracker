const Expenses = require('../models/expenses-model')
const User = require('../models/user-model')

const sequelize = require('../util/database')

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getPageOfExpenses = async (req,res,next) => {
try{

targetPageNumber = parseInt(req.params.pageNumber);

const numberOfExpenses = await Expenses.count({where:{userId:req.user.id}})

const expensesPerPage = parseInt(req.query.items);

const numberOfPages = Math.ceil(numberOfExpenses/expensesPerPage);

expensesOffset = numberOfExpenses - (numberOfPages - targetPageNumber) * expensesPerPage;

console.log(expensesOffset, targetPageNumber, expensesPerPage);

const currentPageExpensesReversed = await Expenses.findAll({
            limit: expensesPerPage,
            where: {
                userId:req.user.id,
                id: {
                    [Op.lte] : expensesOffset
                }
            },

            order: [ [ 'id', 'DESC' ]]
          
        })

const currentPageExpenses = currentPageExpensesReversed.reverse();

res.status(200).json({
    currentPageExpenses,
    numberOfPages
});

    }catch(err){

        console.log(err);

    }        

}

exports.getButtonsAndLastPage = async (req,res,next) => {
    try {
        
    
        const promiseOne = Expenses.count({where:{userId:req.user.id}})
        
        const expensesPerPage = parseInt(req.query.items);
        console.log(expensesPerPage);

        const promiseTwo = Expenses.findAll({
            limit: expensesPerPage,
            where: {
                userId:req.user.id
            },
            order: [ [ 'id', 'DESC' ]]
          
        })
        
        const promiseThree = User.findOne({where:{id:req.user.id}});
        
        const [numberOfExpenses, currentPageExpensesReversed, user] = await Promise.all([promiseOne, promiseTwo, promiseThree])
    
        const premiumStatus = user.ispremiumuser;
        
        const numberOfPages = Math.ceil(numberOfExpenses/expensesPerPage);
        
        console.log(numberOfPages,numberOfExpenses,expensesPerPage)

        const currentPageExpenses = currentPageExpensesReversed.reverse()

        res.status(200).json({
            premiumStatus,
            currentPageExpenses,
            numberOfPages
        });
    }
       catch(err) {
        console.log(err);
       }
}

exports.addExpense = async (req,res,next) => {
    try {
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
