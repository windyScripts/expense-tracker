const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const sequelize = require('./util/database')
const authRoutes = require('./routes/auth')
const expensesRoutes = require('./routes/expenses')
const User = require('./models/user-model');
const Expense = require('./models/expenses-model');

 User.hasMany(Expense);
 Expense.belongsTo(User);

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use('/auth',authRoutes);
app.use(expensesRoutes);

async function start(){
const response = await sequelize.sync();
console.log(response);
app.listen('3000');
}

start();