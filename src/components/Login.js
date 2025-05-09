// src/components/Login.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ connectWallet, isConnecting }) => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-5 rounded-4" style={{ maxWidth: '420px', width: '100%' }}>
        <h2 className="text-center mb-3 fw-bold text-primary">🔐 MultiSig EHR</h2>
        <p className="text-center text-muted mb-4">
          Please connect your MetaMask wallet to access your dashboard.
        </p>

        <button
          className="btn btn-primary w-100"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? '🔄 Connecting...' : '🔗 Connect Wallet'}
        </button>
      </div>
    </div>
  );
};

export default Login;
