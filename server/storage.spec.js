/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
const fs = require('fs');
const path = require('path');
const Storage = require('./storage');
const messages = require('./errorMessages');
const dummyData = require('./dummyData');

describe('Test Storage Class()', () => {

  it('check instance data', () => {
    const storage = new Storage();
    expect(storage.inited).toBeFalsy();
    expect(storage.storagePath).toBeNull();
    expect(storage.memory).toBeNull();
    expect(storage.responseData).toEqual({});
  });

  it('should return error if running without storagePath', () => {
    const storage = new Storage();
    return storage.initMemory().catch((err) => {
      expect(err).toEqual({ message: messages.storage.path });
    });
  });

  it('should create a file with dummy data, if not created', () => {
    const dir = path.join(__dirname, '../', 'data');
    const fileName = '_not_exists.json';
    const filePath = path.join(dir, fileName);
    const storage = new Storage(filePath);

    return storage.initMemory().then(() => {
      const dirFiles = fs.readdirSync(dir);
      const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });

      expect(JSON.parse(fileContent)).toEqual(dummyData);
      expect(storage.memory).toEqual(dummyData);
      expect(storage.responseData).toEqual(messages.status.inited);
      expect(dirFiles.indexOf(fileName) > -1).toBeTruthy();
      fs.unlinkSync(filePath);
    });
  });

  it('should read data from file if it is exists', () => {
    const dir = path.join(__dirname, '../', 'data');
    const fileName = '_i_exist.json';
    const filePath = path.join(dir, fileName);
    const storage = new Storage(filePath);
    const dataToWrite = {
      balance: 900,
      history: [{
        id: '_upq4v6ggx',
        ts: 1591806712499,
        amount: 10,
        type: 'debt',
      }],
    };

    fs.writeFileSync(filePath, JSON.stringify(dataToWrite));

    return storage.initMemory().then(() => {
      const dirFiles = fs.readdirSync(dir);
      const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });

      expect(JSON.parse(fileContent)).toEqual(dataToWrite);
      expect(storage.memory).toEqual(dataToWrite);
      expect(storage.responseData).toEqual(messages.status.inited);
      expect(dirFiles.indexOf(fileName) > -1).toBeTruthy();
      fs.unlinkSync(filePath);
    });
  });

  it('should return error when trying to use saveData method without path', () => {
    const storage = new Storage();
    return storage.saveData(null, { balance: 123 }).catch((err) => {
      expect(err).toEqual({ message: messages.storage.path });
    });
  });

  it('should return error when using saveData to write file to wrong path', () => {
    const storage = new Storage('/not/exited/path');
    const testData = {
      balance: 12,
    };
    // using saveData to write file to wrong path
    return storage.saveData(testData).catch((err) => {
      expect(err.message).toEqual(messages.errors.cantWrite.message);
    });
  });

  it('should return error when trying to use _readStorageFile without path', () => {
    const storage = new Storage();
    return storage._readStorageFile(null, { balance: 123 }).catch((err) => {
      expect(err).toEqual({ message: messages.storage.path });
    });
  });

  it('should return error when using _readStorageFile with wrong path', () => {
    const storage = new Storage('/not/exited/path');
    const testData = {
      balance: 12,
    };
    // using saveData to write file to wrong path
    return storage._readStorageFile(testData).catch((err) => {
      expect(err.message).toEqual(messages.errors.cantFind.message);
    });
  });
});
