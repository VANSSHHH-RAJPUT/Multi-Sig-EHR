// src/components/SiteNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function SiteNavbar({ account, connectWallet, logoutWallet, isConnecting, userRole }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 py-3 shadow">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">MultiSig EHR</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/upload">Upload</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/request-access">Request Access</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/approve-access">Approve Access</Link></li>
          </ul>
        </div>

        <div className="d-flex align-items-center gap-2">
          {account ? (
            <>
              <span className="badge bg-light text-dark">
                ✅ {account.slice(0, 6)}...{account.slice(-4)} {userRole && `(${userRole})`}
              </span>
              <button className="btn btn-danger btn-sm" onClick={logoutWallet}>
                🔌 Logout
              </button>
            </>
          ) : (
            <button className="btn btn-light" onClick={connectWallet} disabled={isConnecting}>
              {isConnecting ? '🔄 Connecting...' : '🔌 Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default SiteNavbar;
