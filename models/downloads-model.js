const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const downloadSchema = new Schema({
    url:{
        type:String,
        required: true
    },
    userId:{
        type:String,
        required:true
    },
    date:{type: Date,
        default: Date.now}
})

module.exports = mongoose.model('Download',downloadSchema)

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Files = sequelize.define('download', {
//   url: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     allowNull: false,
//   },
// });

// module.exports = Files;
