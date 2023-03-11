const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense-tracker','root','Mysucks@55',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;