const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Purchases = sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    paymentid: Sequelize.STRING,
    orderid:Sequelize.STRING,
    status: Sequelize.STRING
})

module.exports = Purchases;