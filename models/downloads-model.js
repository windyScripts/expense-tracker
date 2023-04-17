const Sequelize = require('sequelize')
const sequelize = require('../util/database')

exports.Files = sequelize.define('download',{
    url:{
        type:Sequelize.STRING,
        allowNull:false
    },
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
})