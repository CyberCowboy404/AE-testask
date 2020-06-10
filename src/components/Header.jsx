import React from 'react';
import PropTypes from 'prop-types';

export default function Header(props) {
  const { balance, userId } = props;

  return (
    <header className="header">
      <section>
        <p>
          Current balance:
          {balance}
        </p>
        <p>
          Current User ID:
          {userId}
        </p>
      </section>
    </header>
  );
}

Header.propTypes = {
  balance: PropTypes.number,
  userId: PropTypes.string,
};

Header.defaultProps = {
  balance: 0,
  userId: 'Initing...',
};
