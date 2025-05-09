// src/components/DoctorUpload.js
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { uploadToIPFS } from '../utils/uploadToIPFS';

const DoctorUpload = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async () => {
    if (!file) {
      toast.warn("📂 Please select a file first!");
      return;
    }

    if (!contract || !account) {
      toast.error("❌ Contract not loaded or wallet not connected.");
      return;
    }

    try {
      setIsUploading(true);

      // Upload file to Pinata IPFS
      const ipfsUrl = await uploadToIPFS(file);
      if (!ipfsUrl) {
        toast.error("❌ Failed to upload file to IPFS.");
        return;
      }

      const ipfsHash = ipfsUrl.split("/").pop();

      // Call the smart contract method
      await contract.methods.uploadRecord(ipfsHash).send({ from: account });

      toast.success(`✅ Uploaded & saved on blockchain!\nIPFS: ${ipfsHash}`);
      setFile(null);
    } catch (err) {
      console.error("🚨 Upload error:", err);
      if (err.code === 4001) {
        toast.error("⛔ Transaction rejected in MetaMask.");
      } else {
        toast.error("❌ Upload failed. Check console.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="mb-4">📤 Upload Medical Record</h2>

      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button
        className="btn btn-success"
        onClick={handleFileUpload}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload to IPFS & Blockchain"}
      </button>
    </div>
  );
};

export default DoctorUpload;
