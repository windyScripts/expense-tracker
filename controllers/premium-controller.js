const Razorpay = require('razorpay');
const Order = require('../models/orders-model');

exports.premium = async (req,res,next) => {
    try{
        //console.log("!");
        let rzp = new Razorpay({
            key_id: 'rzp_test_PFB7gF0skVAHJv',
            key_secret: 'lY5EiZOtbJuRpFBRIWqqklpx'
        })
        
        const amount = 2500;

        rzp.orders.create({amount,currency: "INR"}, async (err,order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            const response = await req.user.createOrder({ orderid: order.id, status: 'PENDING'})
            console.log(order, response)
            return res.status(201).json({order,key_id:rzp.key_id});
        })
    }
    catch(err){
        console.log(err);
    }
}

exports.updateTransactionStatus = async (req,res,next) => {
try{
    const { payment_id , order_id} = req.body;
    const order = await Order.findOne({where: {orderid: order_id}})
    await order.update({ paymentid: payment_id, status: 'SUCCESSFUL'})
    await req.user.update({ispremiumuser: true})
    return res.status(202).json({success:true,message:"Transaction Successful"}) 
} catch(err) {
    console.log(err);
}
}