const User = require('../models/user-model');
const Expenses = require('../models/expenses-model');
const sequelize = require('sequelize');

exports.showLeaderboards = async (req,res,next) => {
 try{
    const userLeaderBoard = await User.findAll({
        include: [
            { 
                model:Expenses,
                attributes: []
             }
        ],
        attributes: ['Id','name',[sequelize.fn('sum', sequelize.col('price')), 'total_cost' ]],
        group: ['user-details.id'],
        order: [['total_cost','DESC']]
    });
    res.status(200).json(userLeaderBoard);
}
 catch(err) {
    console.log(err);
 }
}