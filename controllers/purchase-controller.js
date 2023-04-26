const jwt = require('jsonwebtoken');

const Order = require('../services/order-services');
const rzp = require('../services/Rzp-services');

function generateAccessToken(id) {
  const iat = new Date;
  return jwt.sign({ userId: id, date: iat.getTime() }, '12345');
}

exports.premium = async (req, res) => {
  try {
    const amount = 2500;
    const response = await rzp.createOrder(amount);
    return res.status(201).json(response);
  } catch (err) {
    console.log(err);
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { payment_id, order_id, payment_status } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id }});
    if (payment_status === 'SUCCESS') {
      const p1 = order.update({ paymentid: payment_id, status: 'SUCCESS' });
      const p2 = req.user.update({ ispremiumuser: true });
      await Promise.all([p1, p2]);
      const token = generateAccessToken(req.user.id);
      return res.status(202).json({ success: true, message: 'Transaction Successful', token });
    } else if (payment_status === 'FAILURE') {
      await order.update({ paymentid: payment_id, status: 'FAILED' });
      return res.status(403).json({ success: false, message: 'Transaction Failed' });
    }
  } catch (err) {
    console.log('!AC', err);
  }
};
