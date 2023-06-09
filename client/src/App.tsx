import React, { useCallback, useState, useContext } from 'react';

import { TransactionContext } from './context/transaction-context';

import './App.css';

function App() {
  const { connectWallet, currentAccount, sendTransaction, totalDonations, withdraw, isWithdrawLoading, isDonationLoading } = useContext(TransactionContext);
  const [amount, setAmount] = useState('');

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

    const number = e.target.value;

    if(number.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
      setAmount(number);
    }
  }, [setAmount]);

  const handleFloat = useCallback(() => {
    const number = parseFloat(amount);
    if (Number.isNaN(number)) {
      setAmount('');
    } else {
      setAmount(number.toString());
    }
  }, [amount]);

  const onDonate = useCallback(() => {
    if (amount) {
      console.log(amount);
      sendTransaction?.(amount);
      setAmount('');
    }
  }, [amount, sendTransaction]);

  const onWithdraw = useCallback(() => {
    withdraw?.();
  }, [withdraw]);

  return (
    <div className="main">
      <div className="donation">
        <h1 className="heading">Donate</h1>
        {!currentAccount && (
          <button onClick={connectWallet}>Connect wallet</button>
        )}
        {currentAccount && (
          <>
            <label className="label">
              Number of Ethers
              <input
                value={amount}
                onChange={onInputChange}
                onBlur={handleFloat}
              />
            </label>
            <button onClick={onDonate}>{isDonationLoading ? 'Processing ...' : 'Donate'}</button>
          </>
        )}
        <h2>Total donations: {totalDonations} Eth</h2>
      </div>
      <div className="withdraw">
        <h2 className="heading">Withdraw all donations</h2>
        <button onClick={onWithdraw}>{isWithdrawLoading ? 'Processing ...': 'Withdraw'}</button>
      </div>
    </div>
  );
}

export default App;
