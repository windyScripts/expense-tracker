const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');

const Order = require('../models/purchases-model');

function generateAccessToken(id) {
  const iat = new Date;
  return jwt.sign({ userId: id, date: iat.getTime() }, '12345');
}

exports.premium = async (req, res, next) => {
  try {
    //console.log("!");
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 2500;

    rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      const response = await req.user.createOrder({ orderid: order.id, status: 'PENDING' });
      console.log(order, response);
      return res.status(201).json({ order, key_id: rzp.key_id });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const { payment_id, order_id, payment_status } = req.body;
    //console.log(payment_status,"!!!ZZZZ");
    const order = await Order.findOne({ where: { orderid: order_id }});
    if (payment_status === 'SUCCESS') {
      const p1 = order.update({ paymentid: payment_id, status: 'SUCCESS' });
      const p2 = req.user.update({ ispremiumuser: true });
      await Promise.all([p1, p2]);
      return res.status(202).json({ success: true, message: 'Transaction Successful', token: generateAccessToken(req.user.id) });
    } else if (payment_status === 'FAILURE') {
      await order.update({ paymentid: payment_id, status: 'FAILED' });
      return res.status(403).json({ success: false, message: 'Transaction Failed' });
    }
  } catch (err) {
    console.log('!AC', err);
  }
};
