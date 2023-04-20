const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth')
const expensesRoutes = require('./routes/expenses')
const purchaseRoutes = require('./routes/purchase')
/* const premiumRoutes = require('./scrapped/premium') */
const passwordRoutes = require('./routes/password')

const sequelize = require('./util/database')

const User = require('./models/user-model');
const Expense = require('./models/expenses-model');
const Order = require('./models/purchases-model');
const passwordRequest = require('./models/password-requests-model');
const Purchases = require('./models/purchases-model');

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(passwordRequest);
passwordRequest.belongsTo(User);

/* User.hasMany(Purchases);
Purchases.belongsTo(User); */

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use('/auth',authRoutes);
app.use(expensesRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/password',passwordRoutes);


async function start(){
await sequelize.sync();
console.log('Database connected. :)')
app.listen(process.env.PORT || 3000);
}

start();
