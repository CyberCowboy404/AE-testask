/* eslint-disable no-use-before-define */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const TransactionController = require('./server/transaction.controller');

const controller = new TransactionController();

const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, './build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add headers
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use(cookieParser());

app.get('/api/transaction', controller.getTransactionById.bind(controller));
app.get('/api/transactions', controller.getAllTranactions.bind(controller));

app.post('/api/transactions', controller.createTransaction.bind(controller));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
