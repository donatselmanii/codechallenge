import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [userAccounts, setUserAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getUserIdFromCookie = () => {
      const userId = Cookies.get('user');
      return userId ? parseInt(userId) : null;
    };

    const userId = getUserIdFromCookie();
    if (!userId) {
      window.location.href = '/';
      return;
    }

    axios.get(`http://localhost:8080/api/account/user/${userId}`)
      .then((response) => {
        setUserAccounts(response.data);
      })
      .catch((error) => {
        setErrorMessage('An error occurred while fetching user accounts.');
      });

    axios.get(`http://localhost:8080/api/transaction/user/${userId}`)
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        setErrorMessage('An error occurred while fetching transactions.');
      });
  }, []);

  const handleLogout = () => {
    Cookies.remove('user');
    window.location.href = '/';
  };

  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#333', color: '#fff' }}>
        <div>
          <h3>Dashboard</h3>
        </div>
        
        <div>
          <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
          <li style={{ marginRight: '20px' }}>
              <Link to="/create-account" style={{ color: 'white', fontSize: '1.2rem' }}>Create Account</Link>
            </li>
            <li>
              <button style={{ padding: '10px 20px', backgroundColor: 'red', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Your Accounts</h2>
        {userAccounts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {userAccounts.map((account) => (
              <div key={account.id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px', minWidth: '200px' }}>
                <Link to={`/account-details/${account.id}`}>{account.accountName}</Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No accounts found.</p>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Your Transactions</h2>
        {transactions.length > 0 ? (
          <table style={{ borderCollapse: 'collapse', marginTop: '20px', width: '80%' }}>
            <thead>
              <tr style={{ backgroundColor: '#333', color: '#fff' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Transaction ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Amount</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Transaction Reason</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.amount}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.transactionReason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default Dashboard;
