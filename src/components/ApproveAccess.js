import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ApproveAccess = ({ contract, account }) => {
  const [patientAddress, setPatientAddress] = useState('');
  const [requesterAddress, setRequesterAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const approveAccess = async () => {
    if (!contract || !account) return toast.error("❌ Connect wallet and load contract.");
    if (!patientAddress || !requesterAddress) return toast.warning("⚠️ Fill in both addresses.");

    try {
      setLoading(true);

      const doctor = await contract.methods.doctors(account).call();
      if (!doctor.isRegistered) return toast.error("❌ You're not a registered doctor.");

      await contract.methods.approveRecordView(patientAddress, requesterAddress).send({ from: account });
      toast.success("✅ Access approved successfully!");
    } catch (error) {
      console.error("❌ Approval error:", error);
      toast.error(error.code === 4001 ? "❌ Transaction rejected." : "❌ Approval failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h3>📝 Approve Record Access</h3>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Patient Address"
        value={patientAddress}
        onChange={(e) => setPatientAddress(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Requester (Doctor) Address"
        value={requesterAddress}
        onChange={(e) => setRequesterAddress(e.target.value)}
      />
      <button className="btn btn-success" onClick={approveAccess} disabled={loading}>
        {loading ? "Approving..." : "Approve Access"}
      </button>
    </div>
  );
};

export default ApproveAccess;
