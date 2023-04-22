
const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const morgan = require('morgan');

require('dotenv').config()

const authRoutes = require('./routes/user')
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
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),
{ flags: 'a' }
)

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

    const compression = require('compression');
    app.use(compression());
}
else if(environment==='development'){
    const cors = require('cors');
    app.use(cors());
}

app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }))
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
