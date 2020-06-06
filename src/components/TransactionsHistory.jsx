/* eslint-disable react/prop-types */
import React from 'react';

export default class TransactionsHistory extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { onSearch } = this.props;
    const term = event.target.value;

    onSearch(term);
    console.log(this.history);
  }

  render() {
    const { history } = this.props;

    let block = '';

    if (!history || !history.length) {
      block = (
        <tr>
          <td colSpan="4" className="cell100 text-center">No transactions</td>
        </tr>
      );
    } else {
      block = history.map((el) => (
        <tr className={`row100 body ${(el.type === 'debt' ? 'text-red' : '')}`} key={el.id}>
          <td className="cell100 column1">{el.id}</td>
          <td className="cell100 column2">{new Date(el.ts).toLocaleString()}</td>
          <td className="cell100 column3">{el.type}</td>
          <td className="cell100 column4">{el.amount}</td>
        </tr>
      ));
    }

    return (
      <section>

        <h2>Latest Transactions</h2>
        <input type="text" placeholder="Search" onChange={this.handleChange} />

        <div className="table100 ver1 m-b-110">

          <div className="table100-head">
            <table>
              <thead>
                <tr className="row100 head">
                  <th className="cell100 column1">ID</th>
                  <th className="cell100 column2">Time</th>
                  <th className="cell100 column3">Type</th>
                  <th className="cell100 column4">Amount</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="table100-body">
            <table>
              <tbody>
                {block}
              </tbody>
            </table>
          </div>

        </div>

      </section>
    );
  }
}
