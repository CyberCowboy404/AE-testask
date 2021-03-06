/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
// import PropTypes from 'prop-types';
import Transactions from '../lib/agent';

export default class AccountOpperations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      type: 'credit',
      error: {
        visible: false,
        message: '',
      },
    };

    this.makeOperation = this.makeOperation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleChange(event) {
    let amount = event.target.value;

    // Dont allow negative numbers
    if (amount < 0) {
      amount = Math.abs(amount);
    }

    this.setState({ amount });
  }

  handleSelect(event) {
    this.setState({ type: event.target.value });
  }

  // Save and validate tranaction
  makeOperation(event) {
    event.preventDefault();
    const { onBalanceChange } = this.props;

    const error = {
      visible: false,
    };

    const { amount, type } = this.state;
    // Validate amount input
    if (!amount || Number.isNaN(amount)) {
      error.visible = true;
      error.message = 'Wrong Amount!';
      this.setState({ error });
    }

    // If input data clear trying to save it
    if (!error.visible) {
      // Always good to double check everything
      const nAmount = Number(amount);
      const trimType = type.trim();
      Transactions.sendTransaction({ type: trimType, amount: nAmount }).then((data) => {
        // 200 - everything ok
        if (data.status === 200) {
          // Lifting state up
          onBalanceChange(data.balance);
          // Hide previous errors if they are exists
          this.setState({ error: { visible: false } });
        } else if (data.status !== 200) {
          this.setState({ error: { visible: true, message: data.message } });
        } else {
          this.setState({ error: { visible: true, message: 'Unhandled error' } });
        }
      }).catch((err) => {
        this.setState({ error: { visible: true, message: err.message } });
      });
    }
  }

  render() {
    const { amount, error } = this.state;

    let errorBlock = '';
    // If any errors show messages
    if (error.visible) {
      errorBlock = (
        <section className="errors">
          <p>{error.message}</p>
        </section>
      );
    } else {
      errorBlock = '';
    }

    return (
      <div>
        {errorBlock}
        <form onSubmit={this.makeOperation}>

          <div className="form-wrapper-inner">

            <label htmlFor="type">
              <select name="type" id="type" defaultValue="credit" onChange={this.handleSelect}>
                <option value="credit">credit</option>
                <option value="debt">debt</option>
              </select>
            </label>

            <label htmlFor="amount">
              <input value={amount} onChange={this.handleChange} type="number" />
            </label>

            <button type="submit">Add</button>

          </div>

        </form>

      </div>
    );
  }
}
