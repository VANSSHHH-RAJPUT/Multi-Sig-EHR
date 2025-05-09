// src/components/ViewAccessStatus.js
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewAccessStatus = ({ contract, account }) => {
  const [patientAddress, setPatientAddress] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAccess = async () => {
    if (!contract || !account) {
      toast.error("❌ Wallet not connected or contract not loaded.");
      return;
    }

    if (!patientAddress) {
      toast.warning("⚠️ Please enter a patient address.");
      return;
    }

    try {
      setLoading(true);
      const canView = await contract.methods.canViewRecords(patientAddress, account).call();
      setStatus(canView);
    } catch (err) {
      console.error("View access check error:", err);
      toast.error("❌ Error checking access.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h3 className="mb-4">🔎 Check Access Permission</h3>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter Patient Address"
        value={patientAddress}
        onChange={(e) => setPatientAddress(e.target.value)}
      />

      <button
        className="btn btn-primary mb-3"
        onClick={checkAccess}
        disabled={loading}
      >
        {loading ? "Checking..." : "Check Access"}
      </button>

      {status !== null && (
        <div className="alert alert-info">
          {status
            ? "✅ You are approved to view this patient's records."
            : "❌ You are NOT approved to view this patient's records."}
        </div>
      )}
    </div>
  );
};

export default ViewAccessStatus;
