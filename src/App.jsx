/* eslint-disable no-use-before-define */
import React from 'react';
import Cookies from 'js-cookie';
import TransactionsHistory from './components/TransactionsHistory';
import Header from './components/Header';
import AccountOpperations from './components/AccountOperations';
import Transactions from './lib/agent';

import './index.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      balance: 0,
      history: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    if (!Cookies.get('user')) {
      Cookies.set('user', this.uniqId());
    }
    this.getTransactions();
  }

  getTransactions() {
    Transactions.getAllTranactions().then((data) => {
      console.log('data: ', typeof data);
      const { history, balance } = data;
      this.setState({
        history,
        balance,
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  uniqId() {
    return `_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Using for lifting state, updating current balance and tranaction history,
  // when user succesfully did a tranaction
  handleChange() {
    this.getTransactions();
  }

  // Using for state lifting when user types in search box
  handleSearch(term) {
    Transactions.getTransactionById(term).then((data) => {
      const history = data.data;
      this.setState({
        history,
      });
    });
  }

  render() {
    const { balance, history } = this.state;

    return (
      <div className="container">
        <main className="main">
          <Header balance={balance} />
          <AccountOpperations onBalanceChange={this.handleChange} />
          <TransactionsHistory onSearch={this.handleSearch} history={history} />
        </main>
      </div>
    );
  }
}
