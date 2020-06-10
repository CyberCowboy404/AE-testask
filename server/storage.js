/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const messages = require('./errorMessages');
const dummyData = require('./dummyData');

class Storage {
  constructor(storagePath = null) {
    this.inited = false;
    this.storagePath = storagePath;
    this.memory = null;
    this.responseData = {};
    this.dummyData = dummyData;
  }

  initMemory() {
    return new Promise((resolve, reject) => {
      if (!this.storagePath) {
        return reject({ message: messages.storage.path });
      }
      return fs.access(this.storagePath, (error) => {
        // File not exist
        if (error) {
          // Create file and init to memory
          return this.saveData(this.dummyData).then(resolve).catch(reject);
        }
        // Init file to memory
        return this._readStorageFile().then(resolve).catch(reject);
      });
    });
  }

  saveData(data) {
    return new Promise((resolve, reject) => {
      if (!this.storagePath) {
        reject({ message: messages.storage.path });
      }
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
      if (!this.storagePath) {
        reject({ message: messages.storage.path });
      }
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

    return true;
  }
}

module.exports = Storage;
