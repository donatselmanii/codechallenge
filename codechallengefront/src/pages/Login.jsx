import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();

    axios.post(
      'http://localhost:8080/api/users/signin',
      {
        username: username,
        password: password,
      }
    )
    .then((response) => {
      const userId = response.data;
      Cookies.set('user', userId, { expires: 1 });
      navigate('/dashboard');
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid username or password.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    });
  };

  return (
    <div style={{ backgroundColor: '#F0F0F0', color: '#333333', padding: '20px', borderRadius: '8px' }}>
      <h5>Login</h5>
      <p>
        Don't have an account? <a href="/Signup">Create Your Account</a> it takes less than a
        minute
      </p>
      <form onSubmit={login}>
        <div>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br />
        <br />
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
