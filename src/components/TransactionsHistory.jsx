/* eslint-disable react/prop-types */
import React from 'react';

export default function TransactionsHistory(props) {
  const { history } = props;
  let block = '';

  if (!history || !history.length) {
    block = (
      <tr>
        <td colSpan="4" className="text-center">No transactions yet</td>
      </tr>
    );
  } else {
    block = history.map((el) => (
      <tr className="row100 body" key={el.id}>
        <td className="cell100 column1">{el.id}</td>
        <td className="cell100 column2">{new Date(el.ts).toLocaleString()}</td>
        <td className="cell100 column3">{el.type}</td>
        <td className="cell100 column4">{el.amount}</td>
      </tr>
    ));
  }

  return (
    <section>
      <h2>Latest tranactions</h2>
      <input type="text" placeholder="Search" />
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
