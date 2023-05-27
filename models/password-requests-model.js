const mongoose = require('mongoose');
const Schema = mongoose.Schema;

passwordRequestSchema = new Schema({
    isActive: {
        type: Boolean,
        default: true
    },
    date:{type: Date,
        default: Date.now}
})

module.exports = mongoose.model('PasswordRequest',passwordRequestSchema)

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const PasswordRequest = sequelize.define('forgotpasswordrequest', {
//   id: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     primaryKey: true,
//   },
//   isActive: Sequelize.BOOLEAN,
// });

// module.exports = PasswordRequest;
