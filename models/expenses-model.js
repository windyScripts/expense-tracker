const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expenses = sequelize.define('values', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: { 
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date:{
        type:Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW,
        allowNull:false
    },
});

module.exports = Expenses;
