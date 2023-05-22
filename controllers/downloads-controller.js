const Sequelize = require('sequelize');

const Downloads = require('../services/downloads-services');
const Expenses = require('../services/expense-services');

const Op = Sequelize.Op;

const S3 = require('../services/S3-services');

exports.getPDFLink = async (req, res) => {
  try {
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;
    if (endDate < startDate) return res.status(400).json({ message: 'Bad dates' });
    const p1 = Expenses.findAll({
      where: {
        userid: req.user.id,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: ['date','category','name','price']
    });
    const p2 = Expenses.findAll({ // ????????????????????????????????
      where: {
        userid: req.user.id,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        [
          Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-01'),
          'month'
        ],
        [
          Sequelize.fn('SUM', Sequelize.col('price')),
          'totalExpense'
        ],
        'createdAt' // Include the non-aggregated column in the attributes
      ],
      group: [
        Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-01'),
        'createdAt' // Include the non-aggregated column in the GROUP BY clause
      ]
    }); // ????????????????????????????????
const [expenseData,expenseSummary] = await Promise.all([p1,p2])
console.log(expenseData,"#####",expenseSummary)
    const tableData = [];
    tableData.push(['Date', 'Category', 'Expense Name', 'Amount']);
    let summaryRow = 0;
    expenseData.forEach((e,i) => {
      if(expenseData[i+1].date.startsWith('01')&&summaryRow<expenseSummary.length){
        tableData.push(...expenseSummary[summaryRow])
        summaryRow+=1;
      }
      tableData.push([e.date,e.category,e.name,e.price]);
    });
    const stringifiedExpenses = JSON.stringify(tableData);
    const userId = req.user.id;
    const timeStamp = new Date();
    const fileName = `${userId}/${timeStamp}.csv`;
    const fileUrl = await S3.uploadtoS3(stringifiedExpenses, fileName);
    await Downloads.create({
      url: fileUrl,
    });
    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    res.status(500).json({ fileUrl: '', success: false, message: err });
    console.log(err);
  }
};
