import React from "react";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

function Header() {
  return (
    <header>
      <h1>
        <AccountBalanceIcon style={{ marginRight: '20px' }}/>
        Wealthiclone
      </h1>
    </header>
  );
}

export default Header;
