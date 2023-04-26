const Razorpay = require('razorpay');

exports.createOrder = function(amount) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return { message: 'Login failed' };
  }
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    return new Promise((resolve, reject) => {
      rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
        if (err) {
          throw new Error(JSON.stringify(err));
        }
        req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(_ => {
          resolve({ order, key_id: rzp.key_id });
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
};

