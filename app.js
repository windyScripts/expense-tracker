
const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const helmet = require('helmet');
const compression = require('compression');

const app = express();

const mongoose = require('mongoose');
const morgan = require('morgan');

require('dotenv').config();

const expensesRoutes = require('./routes/expenses');
const passwordRoutes = require('./routes/password');
const purchaseRoutes = require('./routes/purchase');
const authRoutes = require('./routes/user');

const environment = process.env.NODE_ENV;
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),
  { flags: 'a' },
);

// allows authorization header from front-end
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  next();
});

if (environment === 'production') {
  app.use(helmet());
  app.use(compression());
/* } else if (environment === 'development') {

} */

  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
  }));

app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use(expensesRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/password', passwordRoutes);

// ✅ Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve React / HTML routes for client-side routing
app.use((req, res, next) => {
  // If the request matches a static file, let express.static handle it
  if (req.path.includes('.') || req.path.endsWith('.css') || req.path.endsWith('.js')) {
    return next(); // pass to express.static or next middleware
  }

  // Otherwise, serve the main HTML page
  res.sendFile(path.join(__dirname, 'public', 'signup', 'index.html'), err => {
    if (err) {
      // Fallback error handling
      console.error('Error sending index.html:', err);
      if (!res.headersSent) {
        res.status(500).send('Internal Server Error');
      }
    }
  });
});

async function start() {
  await mongoose.connect(process.env.DB_STRING);
  console.log('Database connected. :)');
  app.listen(process.env.PORT || 3000);
}

start();
