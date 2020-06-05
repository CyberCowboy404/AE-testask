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

// Function to write data to the json file
function handleTransaction(req, res) {
  // Looking for an user json with data
  const filePath = path.join(__dirname, 'data', `${req.cookies.user}.json`);

  const { type, amount } = req.body.data;
  const ts = new Date().getTime();
  const id = uniqId();
  let responseData = {};
  // Need this for simple validation
  let wrongType = false;
  let wrongAmount = false;
  // Check our types
  if (!type || !(type === 'credit' || type === 'debt')) {
    wrongType = true;
  }
  // Validate if amount is a number
  if (!amount || Number.isNaN(amount) || Number(amount) === 0 || Number(amount) < 0) {
    wrongAmount = true;
  }
  // Return error if data didn't pass validation
  if (wrongType || wrongAmount) {
    responseData = { status: 400, error: { message: 'Bad data' } };
    res.json(responseData);
  }
  // If data pass simpel validation get the user json data
  return fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      responseData = { status: 400, error: { message: 'Can\'t find storage' } };
      return res.json(responseData);
    }
    const memoryFile = JSON.parse(data);
    // If debt we need to decrease account balance
    if (type === 'debt') {
      const temp = memoryFile.balance - amount;
      // If after subtract we have negative value return error
      if (temp < 0) {
        responseData = { status: 403, error: { message: 'Negative balance is Not allowed' } };
        return res.json(responseData);
      }
      // Else mean we have a balance so everything is good
      memoryFile.balance -= amount;
      responseData = { status: 200 };
      // Simply add balance if credit
    } else if (type === 'credit') {
      memoryFile.balance += amount;
      responseData = { status: 200 };
    }
    // In history we save all metadata relative to the transaction
    memoryFile.history.push({
      id,
      ts,
      amount,
      type,
    });

    responseData.balance = memoryFile.balance;
    // Write updated data to the json file
    fs.writeFile(filePath, JSON.stringify(memoryFile), 'utf8', () => {
      res.json(responseData);
    });
  });
}

// This function will be used by the client first, so we init user json here.
function getAllTranactions(req, res) {
  const filePath = path.join(__dirname, 'data', `${req.cookies.user}.json`);
  // Check if json not created yet
  fs.access(filePath, (error) => {
    // File not exist
    if (error) {
      const data = {
        balance: 0,
        history: [],
      };
      // Create a new one
      fs.writeFile(filePath, JSON.stringify(data), 'utf8', (err) => {
        if (err) {
          res.json({ status: 400, error: { message: 'Can\'t write a file' } });
        }
        // Send inited but empty data to the client
        res.json(data);
      });
    } else {
      // File Exist
      fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          res.json({ status: 400, error: { message: 'Can\'t find a file' } });
        }
        // Send existed user data to the client
        res.json(JSON.parse(data));
      });
    }
  });
}

function uniqId() {
  return `_${Math.random().toString(36).substr(2, 9)}`;
}
