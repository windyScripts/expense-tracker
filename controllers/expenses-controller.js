const Expenses = require('../models/expenses-model')
const User = require('../models/user-model')

const sequelize = require('../util/database')

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getPageOfExpenses = async (req,res,next) => {
try{

targetPageNumber = parseInt(req.params.pageNumber);

relativePagePosition = req.query.relativePagePosition;

const numberOfExpenses = await Expenses.count({where:{userId:req.user.id}})

const expensesPerPage = parseInt(req.query.items);

const numberOfPages = Math.ceil(numberOfExpenses/expensesPerPage);

const expensesOffset = numberOfExpenses - (numberOfPages - targetPageNumber) * expensesPerPage;

console.log(expensesOffset, targetPageNumber, expensesPerPage, numberOfPages, numberOfExpenses);

console.log(req.query);

let id;

let order;

if(relativePagePosition==='expensesBack'){

id = {
    [Op.lt] : req.query.id
}

order = [ [ 'id', 'DESC' ]]


} else if(relativePagePosition==='expensesForward'){

id = {
    [Op.gt] : req.query.id
}

order = [ [ 'id', 'ASC' ]]

}else{
    
return res.status(400).json({message:"invalid id"})

}

const unsortedCurrentPageExpenses = await Expenses.findAll({
            limit: expensesPerPage,
            where: {
                userId:req.user.id,
                id: id
            },

            order: order
          
        })
const currentPageExpenses = (relativePagePosition==='expensesBack')?unsortedCurrentPageExpenses.reverse():unsortedCurrentPageExpenses;
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
    const t = await sequelize.transaction();
    try {

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
    const t = await sequelize.transaction();
    try {
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

exports.patchExpense = async function(req,res,next){
    const t = await sequelize.transaction();
try{
    console.log(req.body);
    if(req.body.name.length===0||!Number(req.body.price)) {
        res.status(400).json({message: "invalid data"})
    }
    const id = req.params.eId;
    const expense = await Expenses.findOne({where : {id:id,userId:req.user.id}})
        const updatedExpense = Number(req.user.totalExpense)- Number(expense.price)+Number(req.body.price)
        const userTotalExpenseUpdationPromise = User.update({
            totalExpense: updatedExpense,
            transaction: t
        },
        {
            where: {id: req.user.id}
        })
    expense.category = req.body.category;
    expense.price = parseInt(req.body.price);
    expense.name = req.body.name;
    const expenseChangePromise = expense.save();
    const message = await Promise.all([expenseChangePromise, userTotalExpenseUpdationPromise])    
    await t.commit();
    res.status(200).json(message);
}
catch(err){
    console.log(err);
    await t.rollback();
}
}