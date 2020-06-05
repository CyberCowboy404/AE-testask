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
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      balance: 0,
      history: [],
    };

    if (!Cookies.get('user')) {
      Cookies.set('user', uniqId());
    }

    function uniqId() {
      return `_${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  componentDidMount() {
    this.getTransactions();
  }

  getTransactions() {
    Transactions.getAllTranactions().then((data) => {
      const { history, balance } = data;
      this.setState({
        history,
        balance,
      });
    });
  }

  handleChange() {
    this.getTransactions();
  }

  render() {
    const { balance, history } = this.state;

    return (
      <div className="container">
        <Header balance={balance} />
        <main className="main">
          <AccountOpperations onBalanceChange={this.handleChange} />
          <TransactionsHistory history={history} />
        </main>
      </div>
    );
  }
}
