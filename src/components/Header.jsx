import React from 'react';
import PropTypes from 'prop-types';

export default function Header(props) {
  const { balance } = props;

  return (
    <header className="header">
      <section>
        {balance}
        Current balance: 0
      </section>
    </header>
  );
}

Header.propTypes = {
  balance: PropTypes.number,
};

Header.defaultProps = {
  balance: 0,
};
