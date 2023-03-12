const Expenses = require('../models/expenses-model')

exports.getExpenses = async (req,res,next) => {
   try {
    const products = await Expenses.findAll()
    res.status(200).json(products);
}
   catch(err) {
    console.log(err);
   }
}

exports.addExpense = async (req,res,next) => {
    try { console.log(req);
        const response = await Expenses.create({
            name: req.body.name,
            price: req.body.price
        });
        res.status(200).json(response);
    }
    catch(err) {
     console.log(err);
    }
}

exports.deleteExpense = async (req,res,next) => {
    try {
        const id = req.params.eId;
        const message = await Expenses.destroy({where : {id:id}});
        res.status(200).json(message);
    }
    catch(err) {
     console.log(err);
    }
}