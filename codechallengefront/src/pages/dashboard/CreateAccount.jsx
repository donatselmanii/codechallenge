import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
function getUserIdFromCookie() {
  const userId = Cookies.get('user');
  return userId ? parseInt(userId) : null;
}

function CreateAccount() {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountBalance, setAccountBalance] = useState(0);
  const [accountName, setAccountName] = useState('');
  const userId = getUserIdFromCookie();
  const navigate = useNavigate();


  useEffect(() => {
    axios.get('http://localhost:8080/api/bank/accounts')
      .then((response) => {
        setBanks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching banks:', error);
      });
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();

    const accountData = {
      bank: { id: selectedBank.id },
      user: { id: userId },
      accountBalance: accountBalance,
      accountName: accountName
    };


    axios.post('http://localhost:8080/api/account', accountData)
      .then((response) => {
        console.log('Account created successfully:', response.data);
        setSelectedBank('');
        setAccountBalance(0);
        setAccountName('');
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Error creating account:', error);
      });
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label>Select Bank:</label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(JSON.parse(e.target.value))}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="">Select a bank</option>
            {banks.map((bank) => (
              <option key={bank.id} value={JSON.stringify(bank)}>{bank.bankName}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Account Name:</label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Account Balance:</label>
          <input
            type="number"
            value={accountBalance}
            onChange={(e) => setAccountBalance(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Create Account</button>
      </form>
    </div>
  );
}

export default CreateAccount;
