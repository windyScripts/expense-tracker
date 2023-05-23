const Sequelize = require('sequelize');

const Downloads = require('../services/downloads-services');
const Expenses = require('../services/expense-services');

const Op = Sequelize.Op;

const S3 = require('../services/S3-services');

const puppeteer = require('puppeteer-core');
const {executablePath} = require('puppeteer-core')

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
      attributes: ['date', 'category', 'name', 'price'],
      order: [['date', 'ASC']]
    });
    const p2 = Expenses.findAll({
      where: {
        userid: req.user.id,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        [
          Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'Month'
        ],
        [
          Sequelize.fn('SUM', Sequelize.col('price')),
          'totalExpense',
        ],
      ],
      group: [
        Sequelize.fn('MONTH', Sequelize.col('createdAt'))
      ],
      order:[[
        Sequelize.fn('MONTH', Sequelize.col('createdAt'))
      , 'ASC']]
    }); 
    const [expenseData, expenseSummary] = await Promise.all([p1, p2]);
    const tableData = [];
    tableData.push(['Date', 'Category', 'Expense Name', 'Amount']);
    let summaryRow = 0;
    expenseData.forEach((e, i) => {
      if (i<expenseData.length-1 && expenseData[i + 1].dataValues.date.startsWith('01') && summaryRow < expenseSummary.length) {
        tableData.push(...expenseSummary[summaryRow]);
        summaryRow += 1;
      }
      tableData.push([e.date, e.category, e.name, e.price]);
    });
  const content = tableData;
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setContent(content)
  const buffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
          left: '0px',
          top: '0px',
          right: '0px',
          bottom: '0px'
      },
  })
          await browser.close()

    const stringifiedExpenses = JSON.stringify(tableData);
    const userId = req.user.id;
    const timeStamp = new Date();
    const fileName = `${userId}/${timeStamp}.pdf`;
    const fileUrl = await S3.uploadtoS3(buffer, fileName);
    await Downloads.create({
      url: fileUrl,
    });
    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    res.status(500).json({ fileUrl: '', success: false, message: err });
    console.log(err);
  }
};
