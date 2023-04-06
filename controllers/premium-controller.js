const pdfkit = require('pdfkit');
const blobStream = require('blob-stream')


const User = require('../models/user-model');
const Expenses = require('../models/expenses-model');
const sequelize = require('sequelize');

exports.showLeaderboards = async (req,res,next) => {
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
}

exports.getPDFLink = async (req,res,next) => {
    try{
        const doc = new PDFDocument();
        const stream = doc.pipe(blobStream());
        let startDate = req.query.start_date;
        let endDate = req.query.end_date;
        const expenseData = await Expenses.findAll({
            where: {
                userid: req.user.id,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        })
        const columnWidths = [100, 50, 100,100];
        const tableData = [];
        const tableHeaders = ['Date','Category','Expense Nane','Amount']
        expenseData.forEach(e => {
            tableData.push([e.date,e.category, e.name,e.priceW]);
        })
        doc.font('Helvetica-Bold').fontSize(14).text(`Expenses for the duration from ${startDate} till ${endDate}` ,{ align: 'center' });
        doc.moveDown();
        doc.table(tableData, {
            headers: tableHeaders,
            columnWidths: columnWidths
        })
        doc.end();
        stream.on('finish',() => {
            const url = stream.toBlob('application/pdf')
        })
        res.status(200).json({URL: url})
    }
    catch(err){
        console.log(err);
    }
}