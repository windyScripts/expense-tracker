const Sequelize = require('sequelize');

const Expenses = require('../services/expense-services');
const User = require('../services/user-services');
const sequelize = require('../util/database');

const Op = Sequelize.Op;

exports.getPageOfExpenses = async (req, res) => {
  try {
    const relativePagePosition = req.query.relativePagePosition;

    const numberOfExpenses = await Expenses.count({ where: { userId: req.user.id }});

    const expensesPerPage = parseInt(req.query.items);

    const numberOfPages = Math.ceil(numberOfExpenses / expensesPerPage);

    let id;

    let order;

    if (relativePagePosition === 'expensesBack') {
      id = {
        [Op.lt]: req.query.id,
      };

      order = [['id', 'DESC']];
    } else if (relativePagePosition === 'expensesForward') {
      id = {
        [Op.gt]: req.query.id,
      };

      order = [['id', 'ASC']];
    } else {
      return res.status(400).json({ message: 'invalid id' });
    }

    const unsortedCurrentPageExpenses = await Expenses.findAll({
      limit: expensesPerPage,
      where: {
        userId: req.user.id,
        id,
      },

      order,

    });
    const currentPageExpenses = (relativePagePosition === 'expensesBack') ? unsortedCurrentPageExpenses.reverse() : unsortedCurrentPageExpenses;
    res.status(200).json({
      currentPageExpenses,
      numberOfPages,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getButtonsAndLastPage = async (req, res) => {
  try {
    const promiseOne = Expenses.count({ where: { userId: req.user.id }});

    const expensesPerPage = parseInt(req.query.items);
    console.log(expensesPerPage);

    const promiseTwo = Expenses.findAll({
      limit: expensesPerPage,
      where: {
        userId: req.user.id,
      },
      order: [['id', 'DESC']],

    });

    const promiseThree = User.findOne({ where: { id: req.user.id }});

    const [numberOfExpenses, currentPageExpensesReversed, user] = await Promise.all([promiseOne, promiseTwo, promiseThree]);

    const premiumStatus = user.ispremiumuser;

    const numberOfPages = Math.ceil(numberOfExpenses / expensesPerPage);

    const currentPageExpenses = currentPageExpensesReversed.reverse();

    res.status(200).json({
      premiumStatus,
      currentPageExpenses,
      numberOfPages,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.addOrUpdateExpense = async (req, res) => {
  if (Number(req.body.id)) {
    patchExpense(req, res);
  } else {
    addExpense(req, res);
  }
};

async function addExpense(req, res) {
  if (req.body.name.length === 0 || !Number(req.body.price)) {
    res.status(400).json({ message: 'invalid data' });
  }
  const t = await sequelize.transaction();
  try {
    const expenseCreationPromise = Expenses.create({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      userId: req.user.id,
    }, t);
    const updatedExpense = Number(req.user.totalExpense) + Number(req.body.price);
    const userTotalExpenseUpdationPromise = User.update(req.user, {
      totalExpense: updatedExpense,
    }, t);
    const message = await Promise.all([expenseCreationPromise, userTotalExpenseUpdationPromise]);
    await t.commit();
    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    await t.rollback();
  }
}

exports.deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.eId;
    const expense = await Expenses.findOne({ where: { id, userId: req.user.id }});
    const updatedExpense = Number(req.user.totalExpense) - Number(expense.price);
    const userTotalExpenseUpdationPromise = User.update(req.user, {
      totalExpense: updatedExpense,
    }, t);
    const expenseDeletionPromise = Expenses.destroy({ where: { id, userId: req.user.id }}, t);
    const message = await Promise.all([userTotalExpenseUpdationPromise, expenseDeletionPromise]);
    await t.commit();
    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    await t.rollback();
  }
};

async function patchExpense(req, res) {
  const t = await sequelize.transaction();
  console.log(req.body);
  if (req.body.name.length === 0 || !Number(req.body.price)) {
    res.status(400).json({ message: 'invalid data' });
  }
  try {
    const id = req.params.eId;
    const expense = await Expenses.findOne({ where: { id, userId: req.user.id }});
    const updatedExpense = Number(req.user.totalExpense) - Number(expense.price) + Number(req.body.price);
    const userTotalExpenseUpdationPromise = User.update(req.user, {
      totalExpense: updatedExpense,
    }, t,
    );
    expense.category = req.body.category;
    expense.price = parseInt(req.body.price);
    expense.name = req.body.name;
    const expenseChangePromise = Expenses.save(expense, t);
    const message = await Promise.all([expenseChangePromise, userTotalExpenseUpdationPromise]);
    await t.commit();
    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    await t.rollback();
  }
}

exports.showLeaderboards = async (req, res) => {
  try {
    const userLeaderBoard = await User.findAll({

      attributes: ['name', 'totalExpense'],

      order: [['totalExpense', 'DESC']],

    });

    res.status(200).json(userLeaderBoard);
  } catch (err) {
    console.log(err);
  }
};
