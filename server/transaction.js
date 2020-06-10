/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable prefer-object-spread */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
const path = require('path');
const messages = require('./errorMessages');
const Storage = require('./storage');

class TransactionController {
  constructor() {
    this.types = new Set(['credit', 'debt']);
    this.responseData = { status: null, error: { message: null } };
    this.storage = new Storage();
  }

  // If json file don't exist - create. Else init it to memory
  async init(req) {
    if (!this.storage.inited) {
      const filePath = path.join(__dirname, '../', 'data', `${req.cookies.user}.json`);
      this.storage.storagePath = filePath;

      await this.storage.initMemory();
      return this.storage.memory;
    }
  }

  async createTransaction(req, res) {
    try {
      // If memory didn't exist, try to init it
      await this.init(req);

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

      const transaction = {};
      transaction.history = this.storage.memory.history;
      // Calculate how much we should add to the account
      const balance = type === 'debt'
        ? this.storage.memory.balance - amount
        : this.storage.memory.balance + amount;
      // Update account value
      transaction.balance = balance;
      // Success status
      this.responseData = messages.status.added;
      this.responseData.balance = transaction.balance;
      // In history we save all metadata relative to the transaction
      transaction.history.unshift({
        id,
        ts,
        amount,
        type,
      });
      // Save result to the file
      this.storage.saveData(transaction);

      return res.json(this.responseData);
    } catch (e) {
      console.log('createTransaction: ', e);
    }
  }

  // Return all transactions also init memory file if not inited yet.
  async getAllTranactions(req, res) {
    try {
      await this.init(req);
      res.json(this.storage.memory);
    } catch (e) {
      console.log('getAllTranactions: ', e);
    }
  }

  // Return transaction by id.
  getTransactionById(req, res) {
    const { slug } = req.query;
    const data = this.storage.memory.history.filter((elem) => elem.id.indexOf(slug) !== -1);

    return res.json({ data });
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
      result = (this.storage.memory.balance - amount) >= 0;
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
