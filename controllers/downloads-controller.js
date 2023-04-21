const Expenses = require('../models/expenses-model');
const Downloads = require('../models/downloads-model');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const S3 = require('../services/S3-services')

exports.getPDFLink = async (req,res,next) => {
    try{
        const startDate = req.query.start_date;
        const endDate = req.query.end_date;
        const expenseData = await Expenses.findAll({
            where: {
                userid: req.user.id,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        })
        const tableData = [];
       tableData.push(['Date','Category','Expense Nane','Amount'])
        expenseData.forEach(e => {
            tableData.push([e.date,e.category, e.name,e.price]);
        })
        const stringifiedExpenses = JSON.stringify(tableData);
        const userId = req.user.id
        const timeStamp = new Date();
        const fileName = `${userId}/${timeStamp}`;
        const fileUrl = await S3.uploadtoS3(stringifiedExpenses, fileName);
        await Downloads.create({
            url: fileUrl
        })
        res.status(200).json({ fileUrl , success: true });
    }
    catch(err){
        res.status(500).json({fileUrl:'',success:false,message:err})
    }
}
