// src/components/Register.js
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = ({ contract, account, connectWallet }) => {
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('doctor');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // 🔌 Wallet not connected
    if (!account) {
      toast.warning("🦊 Please connect your MetaMask wallet to register.");
      connectWallet();
      return;
    }

    // 📦 Contract not loaded
    if (!contract) {
      toast.error("❌ Smart contract not available. Please refresh the page.");
      return;
    }

    // 📝 Name validation
    if (!name.trim()) {
      toast.warning("⚠️ Please enter your full name.");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Doctor registration
      if (userType === 'doctor') {
        await contract.methods.registerDoctor(name).send({ from: account });
        toast.success("🎉 Welcome, Doctor! You’ve been successfully registered.");
      } 
      // ✅ Patient registration
      else {
        await contract.methods.registerPatient(name).send({ from: account });
        toast.success("👋 Welcome, Patient! You’ve been successfully registered.");
      }

      setName('');
    } catch (err) {
      console.error("❌ Registration failed:", err);
      toast.error("❌ Registration failed. Please check the console for more details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="mb-4 text-center">📝 Join the MultiSig EHR Platform</h2>
      <p className="text-muted mb-4 text-center">
        Whether you're a doctor or patient, register here to start using our secure EHR system.
      </p>

      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., Dr. Jane Smith or Alex Johnson"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">I am a:</label>
          <select
            className="form-select"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
          {isLoading ? "⏳ Registering..." : "✅ Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
