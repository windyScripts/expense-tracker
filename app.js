const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const authRoutes = require('./routes/auth')
const expensesRoutes = require('./routes/expenses')
const purchaseRoutes = require('./routes/purchase')
const passwordRoutes = require('./routes/password')

const sequelize = require('./util/database')

const User = require('./models/user-model');
const Expense = require('./models/expenses-model');
const Order = require('./models/purchases-model');
const passwordRequest = require('./models/password-requests-model');
const Purchases = require('./models/purchases-model');

const environment = process.env.NODE_ENV;

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(passwordRequest);
passwordRequest.belongsTo(User);

/* User.hasMany(Purchases);
Purchases.belongsTo(User); */
if(environment==='production'){
    const helmet = require('helmet');
    app.use(helmet())
}
else if(environment==='development'){
    const cors = require('cors');
    app.use(cors());
}

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use('/auth',authRoutes);
app.use(expensesRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/password',passwordRoutes);


async function start(){
await sequelize.sync();
console.log('Database connected. :)',environment)
app.listen(process.env.PORT || 3000);
}

start();
