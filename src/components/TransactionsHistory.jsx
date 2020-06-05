/* eslint-disable react/prop-types */
import React from 'react';

export default function TransactionsHistory(props) {
  const { history } = props;
  // console.log('data: ', data);

  return (
    <section>
      <input type="text" />
      <table>
        <caption>Latest tranactions</caption>
        <thead>
          <tr>
            <td>ID</td>
            <td>Time</td>
            <td>type</td>
            <td>amount</td>
          </tr>
        </thead>
        <tbody>
          {history.map((el) => (
            <tr key={el.key}>
              <td>{el.id}</td>
              <td>{new Date(el.ts).toLocaleString()}</td>
              <td>{el.type}</td>
              <td>{el.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
