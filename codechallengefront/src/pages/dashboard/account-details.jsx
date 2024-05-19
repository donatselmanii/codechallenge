import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function AccountDetails() {
  const userId = Cookies.get('user');
  const [accountDetails, setAccountDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferReason, setTransferReason] = useState('');
  const [recipientAccountId, setRecipientAccountId] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositReason, setDepositReason] = useState('');
  const [recipientAccounts, setRecipientAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingTransaction, setProcessingTransaction] = useState(false);
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [processingDeposit, setProcessingDeposit] = useState(false);
  const [processingTransfer, setProcessingTransfer] = useState(false);


  useEffect(() => {
    if (!userId) {
      setErrorMessage('User ID not found in cookies');
      return;
    }

    setLoading(true);
    // Fetch user's account details
    axios.get(`http://localhost:8080/api/account/user/${userId}`)
      .then((response) => {
        setLoading(false);
        if (response.data.length > 0) {
          setAccountDetails(response.data[0]);
        } else {
          setErrorMessage('No account found for the user');
        }
      })
      .catch((error) => {
        setLoading(false);
        setErrorMessage('An error occurred while fetching account details.');
      });
      
    // Fetch recipient accounts
    axios.get(`http://localhost:8080/api/account/user/${userId}`)
      .then((response) => {
        setRecipientAccounts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching recipient accounts:', error);
      });
  }, [userId]);

  const saveTransaction = (transactionData) => {
    const userId = Cookies.get('user');
    const accountId = transactionData.originatingAccountId;
    
    if (!userId || !accountId) {
      console.error('User ID or Account ID not found.');
      return;
    }
  
    const dataWithIds = {
      ...transactionData,
      userId: userId,
      accountId: accountId
    };
  
    axios.post('http://localhost:8080/api/transaction', dataWithIds)
      .then((response) => {
        console.log('Transaction saved:', response.data);
      })
      .catch((error) => {
        console.error('Error saving transaction:', error);
      });
  };
  

  const handleTransfer = () => {
    if (transferAmount <= 0) {
      setErrorMessage('Please enter a valid transfer amount.');
      return;
    }
    if (!recipientAccountId) {
      setErrorMessage('Please select a recipient account.');
      return;
    }
  console.log(accountDetails.id,recipientAccountId,transferAmount);
    setProcessingTransfer(true);
    axios.put('http://localhost:8080/api/account/transfer', {
      senderId: accountDetails.id,
      recipientId: parseInt(recipientAccountId),
      amount: parseFloat(transferAmount)
    })
    .then((response) => {
      setProcessingTransfer(false);
      console.log('Transfer successful:', response.data);
      setTransferAmount(0);
      setTransferReason('');
      setRecipientAccountId('');
      setErrorMessage('');
      
      const transactionData = {
        amount: parseFloat(transferAmount),
        originatingAccountId: accountDetails.id,
        transactionType: 'transfer',
        userId: Cookies.get('user'),
        transactionReason: transferReason
      };
      
      saveTransaction(transactionData);
    })
    .catch((error) => {
      setProcessingTransfer(false);
      setErrorMessage('An error occurred while processing the transfer.');
      console.error('Transfer failed:', error);
    });
  };
  

  const handleWithdrawal = () => {
    if (withdrawalAmount <= 0) {
      setErrorMessage('Please enter a valid withdrawal amount.');
      return;
    }
    
    setProcessingWithdrawal(true);
    axios.put(`http://localhost:8080/api/account/withdraw/${accountDetails.id}/${withdrawalAmount}`, { reason: withdrawalReason })
      .then((response) => {
        setProcessingWithdrawal(false);
        setAccountDetails({ ...accountDetails, accountBalance: response.data });
        setWithdrawalAmount(0);
        setWithdrawalReason('');
        setErrorMessage('');
        
        const transactionData = {
            amount: withdrawalAmount,
            originatingAccountId: accountDetails.id,
            transactionType: 'withdrawal',
            userId: Cookies.get('user'),
            transactionReason: withdrawalReason
          };
          
        saveTransaction(transactionData);
      })
      .catch((error) => {
        setProcessingWithdrawal(false);
        setErrorMessage('An error occurred while processing the withdrawal.');
      });
  };

  const handleDeposit = () => {
    if (depositAmount <= 0) {
      setErrorMessage('Please enter a valid deposit amount.');
      return;
    }
    
    setProcessingDeposit(true);
    axios.put(`http://localhost:8080/api/account/deposit/${accountDetails.id}/${depositAmount}`, { reason: depositReason })
      .then((response) => {
        setProcessingDeposit(false);
        setAccountDetails({ ...accountDetails, accountBalance: response.data });
        setDepositAmount(0);
        setDepositReason('');
        setErrorMessage('');
        
        const transactionData = {
            amount: withdrawalAmount,
            originatingAccountId: accountDetails.id,
            transactionType: 'withdrawal',
            userId: Cookies.get('user'),
            transactionReason: withdrawalReason
          };
          
        saveTransaction(transactionData);
      })
      .catch((error) => {
        setProcessingDeposit(false);
        setErrorMessage('An error occurred while processing the deposit.');
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Account Details</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          accountDetails && (
            <div>
              <p style={styles.detail}>Bank Name: {accountDetails.bankName}</p>
              <p style={styles.detail}>Account Name: {accountDetails.accountName}</p>
              <p style={styles.detail}>Account Balance: {accountDetails.accountBalance}</p>
            </div>
          )
        )}
      </div>
      <div style={styles.card}>
        <h2 style={styles.heading}>Send Money to Another Account</h2>
        <input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
        <input type="text" value={transferReason} onChange={(e) => setTransferReason(e.target.value)} placeholder="Reason for transaction" />
        <select value={recipientAccountId} onChange={(e) => setRecipientAccountId(e.target.value)}>
          <option value="">Select money to another account</option>
          {recipientAccounts.map((account) => (
            <option key={account.id} value={account.id}>{account.accountName}</option>
          ))}
        </select>
        <button onClick={handleTransfer} disabled={processingTransaction}>
          {processingTransaction ? 'Processing...' : 'Transfer'}
        </button>
        {errorMessage && <p style={{ ...styles.detail, color: 'red' }}>{errorMessage}</p>}
      </div>
      <div style={styles.card}>
        <h2 style={styles.heading}>Withdraw Money</h2>
        <input type="number" value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(e.target.value)} />
        <input type="text" value={withdrawalReason} onChange={(e) => setWithdrawalReason(e.target.value)} placeholder="Reason for withdrawal" />
        <button onClick={handleWithdrawal} disabled={processingWithdrawal}>
          {processingWithdrawal ? 'Processing...' : 'Withdraw'}
        </button>
        {errorMessage && <p style={{ ...styles.detail, color: 'red' }}>{errorMessage}</p>}
      </div>
      <div style={styles.card}>
        <h2 style={styles.heading}>Deposit Money</h2>
        <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
        <input type="text" value={depositReason} onChange={(e) => setDepositReason(e.target.value)} placeholder="Reason for deposit" />
        <button onClick={handleDeposit} disabled={processingDeposit}>
          {processingDeposit ? 'Processing...' : 'Deposit'}
        </button>
        {errorMessage && <p style={{ ...styles.detail, color: 'red' }}>{errorMessage}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    maxWidth: '1000px',
    margin: 'auto',
    padding: '20px',
  },
  card: {
    maxWidth: '400px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 2px 4px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  detail: {
    fontSize: '18px',
    marginBottom: '10px',
  },
};

export default AccountDetails;

