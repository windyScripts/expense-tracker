const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      userId:{
        type: String,
        required: true
      },
      date:  {type: Date, default: Date.now},
})

module.exports = new mongoose.model('Expense',expenseSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Expenses = sequelize.define('expense', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   price: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },
//   category: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   date: {
//     type: Sequelize.DATEONLY,
//     defaultValue: Sequelize.NOW,
//     allowNull: false,
//   },
// });

// module.exports = Expenses;
