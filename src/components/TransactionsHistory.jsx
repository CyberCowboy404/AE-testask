import React from 'react';
import Transactions from '../lib/agent';

export default class TransactionsHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    Transactions.getAllTranactions().then((data = []) => {
      console.log('data: ', data);
      this.setState({ data });
    });
  }

  render() {
    const { data } = this.state;

    return (
      <section>
        <input type="text" />
        <table>
          <caption>Latest tranactions</caption>
          <thead>
            <tr>
              <td>ID</td>
              <td>type</td>
              <td>amount</td>
            </tr>
          </thead>
          <tbody>
            {data.history.map((el) => (
              <tr key={el.key}>
                <td>{el.id}</td>
                <td>{el.time}</td>
                <td>{el.type}</td>
                <td>{el.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }
}
