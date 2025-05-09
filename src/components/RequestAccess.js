import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestAccess = ({ contract, account }) => {
  const [patientAddress, setPatientAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const requestAccess = async () => {
    if (!contract || !account) {
      toast.error("❌ Connect your wallet and load the contract.");
      return;
    }

    if (!patientAddress) {
      toast.warning("⚠️ Enter a patient address.");
      return;
    }

    try {
      setLoading(true);

      const doctor = await contract.methods.doctors(account).call();
      const patient = await contract.methods.patients(patientAddress).call();

      if (!doctor.isRegistered) return toast.error("❌ You're not registered as a doctor.");
      if (!patient.isRegistered) return toast.error("❌ Patient is not registered.");

      await contract.methods.requestRecordView(patientAddress).send({ from: account });
      toast.success("✅ Access request submitted!");
    } catch (error) {
      console.error("❌ Request error:", error);
      toast.error("❌ Request failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h3>📥 Request Record Access</h3>
      <input
        type="text"
        placeholder="Enter Patient Address"
        className="form-control mb-3"
        value={patientAddress}
        onChange={(e) => setPatientAddress(e.target.value)}
      />
      <button className="btn btn-primary" onClick={requestAccess} disabled={loading}>
        {loading ? "Requesting..." : "Request Access"}
      </button>
    </div>
  );
};

export default RequestAccess;
