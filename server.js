/* eslint-disable no-use-before-define */
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, './build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/build/index.html`));
});

app.get('/api/transactions', getAllTranactions);

app.post('/api/transactions', handleTransaction);

function handleTransaction(req, res) {
  const filePath = path.join(__dirname, 'data', `${req.cookies.user}.json`);

  const { type, amount } = req.body.data;
  const ts = new Date().getTime();
  const id = uniqId();
  let responseData = {};
  let wrongType = false;
  let wrongAmount = false;

  if (!type || !(type === 'credit' || type === 'debt')) {
    wrongType = true;
  }

  if (!amount || Number.isNaN(amount) || Number(amount) === 0 || Number(amount) < 0) {
    wrongAmount = true;
  }

  if (wrongType || wrongAmount) {
    responseData = { statusCode: 400, error: { message: 'Bad data' } };
    res.json(JSON.stringify(responseData));
  }

  fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      responseData = { statusCode: 400, error: { message: 'Can\'t find storage' } };
      res.json(JSON.stringify(responseData));
    } else {
      const memoryFile = JSON.parse(data);

      if (type === 'debt') {
        const temp = memoryFile.balance - amount;
        if (temp < 0) {
          responseData = { statusCode: 403, error: { message: 'Negative balance is Not allowed' } };
          res.json(JSON.stringify(responseData));
        } else {
          memoryFile.balance -= amount;
          responseData = { statusCode: 200 };
        }
      } else if (type === 'credit') {
        memoryFile.balance += amount;
        responseData = { statusCode: 200 };
      }

      memoryFile.history.push({
        id,
        ts,
        amount,
        type,
      });

      responseData.balance = memoryFile.balance;

      fs.writeFile(filePath, JSON.stringify(memoryFile), 'utf8', () => {
        res.json(JSON.stringify(responseData));
      });
    }
  });
}

function getAllTranactions(req, res) {
  const filePath = path.join(__dirname, 'data', `${req.cookies.user}.json`);

  fs.access(filePath, (error) => {
    if (error) {
      const data = {
        balance: 0,
        history: [],
      };
      fs.writeFile(filePath, JSON.stringify(data), 'utf8', (err) => {
        if (err) {
          res.json({ statusCode: 400, error: { message: 'Can\'t write a file' } });
        }
        res.json(JSON.stringify(data));
      });
    } else {
      fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          res.json({ statusCode: 400, error: { message: 'Can\'t find a file' } });
        }
        res.json(JSON.parse(data));
      });
    }
  });
}

function uniqId() {
  return `_${Math.random().toString(36).substr(2, 9)}`;
}
