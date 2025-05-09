// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import Web3 from 'web3';
import EHRSystem from './artifacts/contracts/MultiSigEHR.sol/MultiSigEHR.json';

import SiteNavbar from './components/SiteNavbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DoctorUpload from './components/DoctorUpload';
import RequestAccess from './components/RequestAccess';
import ApproveAccess from './components/ApproveAccess';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userRole, setUserRole] = useState('');

  const contractAddress = '0xd803f74FD5A3FE08cE828A68923fb54489a08E0F';

  const fetchUserRole = async (contractInstance, currentAccount) => {
    try {
      const doctor = await contractInstance.methods.doctors(currentAccount).call();
      const patient = await contractInstance.methods.patients(currentAccount).call();

      if (doctor.isRegistered) {
        setUserRole('Doctor');
      } else if (patient.isRegistered) {
        setUserRole('Patient');
      } else {
        setUserRole('Unregistered');
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
      setUserRole('');
    }
  };

  const loadContract = useCallback(async (web3Instance, currentAccount) => {
    try {
      const contractInstance = new web3Instance.eth.Contract(EHRSystem.abi, contractAddress);
      setContract(contractInstance);
      console.log('✅ Smart contract loaded');
      await fetchUserRole(contractInstance, currentAccount);
    } catch (error) {
      console.error('⚠️ Error loading contract:', error);
    }
  }, [contractAddress]);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert('🦊 Please install MetaMask to use this app.');
      return;
    }

    setIsConnecting(true);
    const web3 = new Web3(window.ethereum);

    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await loadContract(web3, accounts[0]);
      } else {
        const requestedAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(requestedAccounts[0]);
        await loadContract(web3, requestedAccounts[0]);
      }
    } catch (error) {
      if (error.code === -32002) {
        alert('🕒 MetaMask connection request already pending. Please approve it.');
      } else {
        console.error('❌ Wallet connection error:', error);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [loadContract]);

  const logoutWallet = () => {
    setAccount('');
    setContract(null);
    setUserRole('');
    console.log("👋 Wallet disconnected from frontend.");
  };

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  return (
    <Router>
      <SiteNavbar
        account={account}
        connectWallet={connectWallet}
        logoutWallet={logoutWallet}
        isConnecting={isConnecting}
        userRole={userRole}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login contract={contract} account={account} connectWallet={connectWallet} isConnecting={isConnecting} />} />
        <Route path="/register" element={<Register contract={contract} account={account} connectWallet={connectWallet} />} />
        <Route path="/dashboard" element={<Dashboard contract={contract} account={account} />} />
        <Route path="/upload" element={<DoctorUpload contract={contract} account={account} />} />
        <Route path="/request-access" element={<RequestAccess contract={contract} account={account} />} />
        <Route path="/approve-access" element={<ApproveAccess contract={contract} account={account} />} />
      </Routes>
    </Router>
  );
}

export default App;
