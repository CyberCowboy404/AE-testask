/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const messages = require('./errorMessages');

class Storage {
  constructor(storagePath) {
    this.inited = false;
    this.storagePath = storagePath;
    this.memory = null;
  }

  initMemory() {
    return new Promise((resolve, reject) => {
      fs.access(this.storagePath, (error) => {
        // File not exist
        if (error) {
          const data = {
            balance: 0,
            history: [],
          };
          // Create file and init to memory
          return this.saveData(data, this._readStorageFile).then(resolve).catch(reject);
        }
        // Init file to memory
        return this._readStorageFile().then(resolve).catch(reject);
      });
    });
  }

  saveData(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.storagePath, JSON.stringify(data),
        'utf8', (err) => {
          if (err) {
            return reject(this._handleErrorStatus(messages.errors.cantWrite, err));
          }
          return resolve(this._initMemory(data));
        });
    });
  }

  _readStorageFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.storagePath, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          return reject(this._handleErrorStatus(messages.errors.cantFind, err));
        }
        return resolve(this._initMemory(JSON.parse(data)));
      });
    });
  }

  _handleErrorStatus(message, err = {}) {
    this.responseData = message;
    return { ...err, ...this.responseData };
  }

  _initMemory(data) {
    this.memory = data;
    this.responseData = messages.status.inited;
    this.inited = true;
  }
}

module.exports = Storage;
