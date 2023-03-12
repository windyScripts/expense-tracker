const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const sequelize = require('./util/database')
const authRoutes = require('./routes/auth')

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use('/auth',authRoutes);

async function start(){
await sequelize.sync();
console.log("Database connected");
app.listen('3000');
}

start();