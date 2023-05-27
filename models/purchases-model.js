const mongoose = require('mongoose');
const Schema = mongoose.Schema;

ordersSchema = new Schema({
userId:{
    type: String,
    required: true
},
paymentId: String,
orderId: String,
status: {
    type: String,
    required: true
}
})

module.exports = mongoose.model('Order',ordersSchema)
// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Purchases = sequelize.define('order', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   paymentid: Sequelize.STRING,
//   orderid: Sequelize.STRING,
//   status: Sequelize.STRING,
// });

// module.exports = Purchases;
