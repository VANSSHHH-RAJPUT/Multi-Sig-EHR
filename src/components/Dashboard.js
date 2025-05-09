import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = ({ contract, account }) => {
  const [records, setRecords] = useState([]);
  const [patientAddress, setPatientAddress] = useState("");
  const [doctorToTrust, setDoctorToTrust] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // ✅ Identify the user role (doctor, patient, or unregistered)
  useEffect(() => {
    const checkRole = async () => {
      if (!contract || !account) return;

      try {
        const doctor = await contract.methods.doctors(account).call();
        const patient = await contract.methods.patients(account).call();

        if (doctor.isRegistered) setUserRole("doctor");
        else if (patient.isRegistered) setUserRole("patient");
        else setUserRole("unregistered");
      } catch (error) {
        console.error("Error checking role:", error);
        toast.error("Unable to determine your role.");
      }
    };

    checkRole();
  }, [contract, account]);

  // ✅ Doctor: Fetch a patient’s medical records if access is granted
  const fetchRecords = async () => {
    if (!patientAddress) return toast.warning("Please enter a patient address.");
    if (!contract || !account) return toast.error("Smart contract or wallet not connected.");

    try {
      setLoading(true);

      const accessGranted = await contract.methods
        .canViewRecords(patientAddress, account)
        .call();

      if (!accessGranted) {
        toast.info("⏳ Access not granted yet. Wait for patient approvals.");
        return;
      }

      const result = await contract.methods
        .getPatientRecords(patientAddress)
        .call({ from: account });

      setRecords(result);
      toast.success("📥 Medical records retrieved successfully.");
    } catch (error) {
      console.error("❌ Error fetching records:", error);
      toast.error("An error occurred while fetching records.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Patient: Add a trusted doctor to approve future access
  const trustDoctor = async () => {
    if (!doctorToTrust) return toast.warning("Enter the doctor’s Ethereum address.");
    if (!contract || !account) return toast.error("Smart contract or wallet not connected.");

    try {
      await contract.methods.addTrustedDoctor(doctorToTrust).send({ from: account });
      toast.success("✅ Doctor added to your trusted list!");
      setDoctorToTrust("");
    } catch (error) {
      console.error("❌ Trust doctor error:", error);
      toast.error("Could not trust doctor. Make sure the address is valid and doctor is registered.");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">🩺 Your Medical Dashboard</h2>

      {/* Doctor View */}
      {userRole === "doctor" && (
        <>
          <div className="mb-3">
            <label>Patient Ethereum Address</label>
            <input
              className="form-control"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
              placeholder="0x... (Patient address)"
            />
          </div>
          <button
            className="btn btn-primary mb-4"
            onClick={fetchRecords}
            disabled={loading}
          >
            {loading ? "Fetching..." : "📄 Fetch Patient Records"}
          </button>
        </>
      )}

      {/* Patient View */}
      {userRole === "patient" && (
        <>
          <hr className="my-5" />
          <h5>🔐 Add a Trusted Doctor</h5>
          <input
            className="form-control mb-2"
            placeholder="Doctor’s Ethereum Address"
            value={doctorToTrust}
            onChange={(e) => setDoctorToTrust(e.target.value)}
          />
          <button className="btn btn-success" onClick={trustDoctor}>
            ➕ Trust This Doctor
          </button>
        </>
      )}

      {/* Records List */}
      {records.length > 0 && (
        <div className="card mt-5">
          <div className="card-header">📂 Patient Medical Records</div>
          <ul className="list-group list-group-flush">
            {records.map((record, index) => (
              <li key={index} className="list-group-item">
                <strong>IPFS:</strong>{" "}
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Record #{index + 1}
                </a>
                <br />
                <strong>Uploaded By:</strong> {record.uploadedBy}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No Records Message */}
      {records.length === 0 && !loading && userRole === "doctor" && (
        <div className="text-muted mt-4">No records found or access not granted yet.</div>
      )}

      {/* Unregistered User View */}
      {userRole === "unregistered" && (
        <div className="alert alert-warning mt-4">
          ⚠️ You are not registered. Please register as a doctor or patient first.
        </div>
      )}
    </div>
  );
};

export default Dashboard;
