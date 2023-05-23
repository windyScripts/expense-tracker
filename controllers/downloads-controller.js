const PdfPrinter = require('pdfmake');
const Sequelize = require('sequelize');

const Downloads = require('../services/downloads-services');
const Expenses = require('../services/expense-services');
const S3 = require('../services/S3-services');

const Op = Sequelize.Op;

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
      order: [['date', 'ASC']],
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
          Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'Month',
        ],
        [
          Sequelize.fn('SUM', Sequelize.col('price')),
          'totalExpense',
        ],
      ],
      group: [
        Sequelize.fn('MONTH', Sequelize.col('createdAt')),
      ],
      order: [[
        Sequelize.fn('MONTH', Sequelize.col('createdAt')),
        'ASC',
      ]],
    });
    const [expenseData, expenseSummary] = await Promise.all([p1, p2]);
    console.log(expenseData[0].dataValues.date, expenseData[0].dataValues.date.slice(5, 7));
    const tableData = [];
    tableData.push(['Date', 'Category', 'Expense Name', 'Amount']);
    let summaryRow = 0;
    expenseData.forEach((e, i) => {
      tableData.push([e.date, e.category, e.name, e.price]);
      const len = expenseData.length;
      if (((i < len - 1 && ((expenseData[i + 1].dataValues.date[6] > expenseData[i].dataValues.date[6]) || expenseData[i + 1].dataValues.date.slice(5, 7) == '12' && expenseData[i].dataValues.date.slice(5, 7) == '01')) || (i === len - 1)) && summaryRow < expenseSummary.length) {
        tableData.push(['Monthly summary:', '', '', '']);
        tableData.push(['Month: ', expenseSummary[summaryRow].dataValues.Month, 'Amount: ', expenseSummary[summaryRow].dataValues.totalExpense]);
        summaryRow += 1;
      }
    });

    var fonts = {
      Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique',
      },
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
      Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic',
      },
      Symbol: {
        normal: 'Symbol',
      },
      ZapfDingbats: {
        normal: 'ZapfDingbats',
      },
    };

    const printer = new PdfPrinter(fonts);
    //var fs = require('fs');

    const docDefinition = {
      content: [
        {
          layout: 'lightHorizontalLines', // optional
          table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto'],

            body: tableData,
          },
        },
      ],
      defaultStyle: {
        font: 'Helvetica',
      },
    };

    const pdfMake = printer.createPdfKitDocument(docDefinition);

    const chunks = [];

    pdfMake.on('data', chunk => {
      chunks.push(chunk);
    });

    pdfMake.on('end', async () => {
      const result = Buffer.concat(chunks);
      const userId = req.user.id;
      const timeStamp = new Date();
      const fileName = `${userId}/${timeStamp}.pdf`;
      const fileUrl = await S3.uploadtoS3(result, fileName);
      await Downloads.create({
        url: fileUrl,
        userId: req.user.id,
      });
      res.status(200).json({ fileUrl, success: true });
    });

    pdfMake.end();
  } catch (err) {
    res.status(500).json({ fileUrl: '', success: false, message: err });
    console.log(err);
  }
};

exports.getDownloadLinks = async (req, res) => {
  try {
    const fileUrls = await Downloads.findAll({
        where: { userId: req.user.id },
        attributes: ['url', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 5,
      });
    res.status(200).json({ fileUrls, success: true });
  } catch (err) {
    res.status(500).json({ fileUrls: '', success: false, message: err });
  }
};
