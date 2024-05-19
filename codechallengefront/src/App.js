import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/dashboard/Dashboard';
import CreateAccount from './pages/dashboard/CreateAccount';
import AccountDetails from './pages/dashboard/account-details';
import Signup from './pages/Signup';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/account-details/:accountId" element={<AccountDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
