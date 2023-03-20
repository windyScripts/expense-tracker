const User = require('../models/user-model');
const Expenses = require('../models/expenses-model');
const sequelize = require('sequelize');

exports.showLeaderboards = async (req,res,next) => {
 try{
    const userLeaderBoard = await User.findAll({
        attributes: ['name','totalExpense'],
        order: [['totalExpense','DESC']]
    });
    res.status(200).json(userLeaderBoard);
}
 catch(err) {
    console.log(err);
 }
}