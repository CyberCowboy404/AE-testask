import React from 'react';
import PropTypes from 'prop-types';

export default function Header(props) {
  const { balance } = props;

  return (
    <header className="header">
      <section>
        Current balance:
        {balance}
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
