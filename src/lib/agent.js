import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:8080/api';

const responseBody = (res) => res.body;

const requests = {
  del: (url) => superagent.del(`${API_ROOT}${url}`).then(responseBody),
  get: (url) => superagent.get(`${API_ROOT}${url}`).then(responseBody),
  put: (url, body) => superagent.put(`${API_ROOT}${url}`, body).then(responseBody),
  post: (url, body) => superagent.post(`${API_ROOT}${url}`, body).then(responseBody),
};

const Transactions = {
  sendTransaction: (data) => requests.post('/transactions', { data }),
  getAllTranactions: () => requests.get('/transactions'),
  getTransactionById: (slug) => requests.del(`/transactions/${slug}`),
};

export default Transactions;
