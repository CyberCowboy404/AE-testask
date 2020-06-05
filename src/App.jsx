import React from 'react';
import Cookies from 'js-cookie';
import TransactionsHistory from './components/TransactionsHistory';
import Header from './components/Header';
import AccountOpperations from './components/AccountOperations';

import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      balance: 0,
    };

    function uniqId() {
      return `_${Math.random().toString(36).substr(2, 9)}`;
    }

    Cookies.set('user', uniqId());
  }

  handleChange(balance) {
    this.setState({
      balance,
    });
  }

  render() {
    const { balance } = this.state;

    return (
      <div className="container">

        <Header balance={balance} />

        <main className="main">
          <AccountOpperations onBalanceChange={this.handleChange} />
          <TransactionsHistory balance={balance} />
        </main>
      </div>
    );
  }
}
