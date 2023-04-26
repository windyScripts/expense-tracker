const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const PasswordRequest = sequelize.define('forgotpasswordrequest',{
    id:{
        type:Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    isActive: Sequelize.BOOLEAN,
})

module.exports = PasswordRequest;