import React from 'react';
import Transactions from '../lib/agent';

export default class TransactionsHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [],
    };
  }

  componentDidMount() {
    Transactions.getAllTranactions().then((data = []) => {
      console.log('data: ', data);
      this.setState({
        history: data.history,
      });
    });
  }

  render() {
    const { history } = this.state;
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
                <td>{new Date().toLocaleString()}</td>
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
