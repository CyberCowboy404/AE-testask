/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable prefer-object-spread */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
const fs = require('fs');
const path = require('path');
const messages = require('./errorMessages');

class TransactionController {
  constructor() {
    this.types = new Set(['credit', 'debt']);
    this.responseData = { status: null, error: { message: null } };
    this.inited = false;
    this.filePath = null;
    this.memoryFile = null;
  }

  // If json file don't exist - create. Else init it to memory
  init(req) {
    if (this.inited) return;

    this.filePath = path.join(__dirname, '../', 'data', `${req.cookies.user}.json`);

    return new Promise((resolve, reject) => {
      fs.access(this.filePath, (error) => {
        // File not exist
        if (error) {
          const data = {
            balance: 0,
            history: [],
          };
          // Create file and init to memory
          return this._writeFileJSON(data, this._readStorageFile).then(resolve).catch(reject);
        }
        // Init file to memory
        return this._readStorageFile().then(resolve).catch(reject);
      });
    });
  }

  async createTransaction(req, res) {
    try {
      // If memory didn't exist, try to init it
      if (!this.inited) {
        await this.init(req);
      }
      const { type, amount } = req.body.data;
      const ts = new Date().getTime();
      const id = this._uniqId();
      // Validate data
      const isValid = this._compare([
        this._isRightType(type),
        this._isRightNumber(amount),
        this._isValidAfterDebt(type, amount),
      ]);
      // Something went wront during validation
      if (!isValid) {
        this.responseData = messages.errors.badData;
        return res.json(this.responseData);
      }

      // Calculate how much we should add to the account
      const temp = type === 'debt' ? this.memoryFile.balance - amount : this.memoryFile.balance + amount;
      // Update account value
      this.memoryFile.balance = temp;
      // Success status
      this.responseData = messages.status.added;
      this.responseData.balance = this.memoryFile.balance;
      // In history we save all metadata relative to the transaction
      this.memoryFile.history.unshift({
        id,
        ts,
        amount,
        type,
      });
      // Save result to the file
      this._writeFileJSON(this.memoryFile);

      return res.json(this.responseData);
    } catch (e) {
      console.log('createTransaction: ', e);
    }
  }

  // Return all transactions also init memory file if not inited yet.
  async getAllTranactions(req, res) {
    try {
      if (!this.inited) {
        await this.init(req);
      }
      res.json(this.memoryFile);
    } catch (e) {
      console.log('getAllTranactions: ', e);
    }
  }

  // Return transaction by id.
  getTransactionById(req, res) {
    const { slug } = req.query;
    const filteredData = this.memoryFile.history.filter((elem) => elem.id.indexOf(slug) !== -1);

    return res.json({ data: filteredData });
  }

  _writeFileJSON(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath, JSON.stringify(data),
        'utf8', (err) => {
          if (err) {
            this.responseData = messages.errors.cantWrite;
            return reject({ ...err, ...this.responseData });
          }
          return resolve(this._initMemory(data));
        });
    });
  }

  _readStorageFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          this.responseData = messages.errors.cantFind;
          return reject({ ...err, ...this.responseData });
        }
        return resolve(this._initMemory(JSON.parse(data)));
      });
    });
  }

  _initMemory(data) {
    this.memoryFile = data;
    this.responseData = messages.status.inited;
    this.inited = true;
  }

  _isRightType(value) {
    return value && this.types.has(value);
  }

  _isRightNumber(value) {
    return value > 0;
  }

  _isValidAfterDebt(type, amount) {
    let result = true;
    if (type === 'debt') {
      result = (this.memoryFile.balance - amount) >= 0;
    }
    return result;
  }

  _compare(fns) {
    return fns.every(Boolean);
  }

  _uniqId() {
    return `_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = TransactionController;
