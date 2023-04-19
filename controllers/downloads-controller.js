const User = require('../models/user-model');
const Expenses = require('../models/expenses-model');
const Downloads = require('../models/downloads-model');

const sequelize = require('sequelize');
const Op = sequelize.Op;

const AWS = require('aws-sdk');

/* exports.showLeaderboards = async (req,res,next) => {
 try{
    const userLeaderBoard = await User.findAll({
        attributes: ['name','totalExpense'],
        order: [['totalExpense','DESC']]
    });
    res.status(200).json(userLeaderBoard);
}
 catch(err) {
    console.log(err);
 }
} */

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
        const fileUrl = await uploadtoS3(stringifiedExpenses, fileName);
        await Downloads.create({
            url: fileUrl
        })
        res.status(200).json({ fileUrl , success: true });
    }
    catch(err){
        res.status(500).json({fileUrl:'',success:false,message:err})
    }
}

async function uploadtoS3 (data, fileName) {
    try{
    let s3Bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
    })

    var params = {
        Bucket: process.env.BUCKET_NAME,
        Key:fileName,
        Body: data,
        ACL: 'public-read'
    }
        return new Promise((resolve,reject)=> {
            s3Bucket.upload(params, (err, s3response) =>{
                if(err){
                    console.log('Something went wrong', err)
                    reject(err);
                }else {
                    console.log('Success');
                    resolve(s3response.Location);
                }
            })
        }) 
    }
    catch(err){
        return new Promise((resolve,reject) => reject(err))
    }
}