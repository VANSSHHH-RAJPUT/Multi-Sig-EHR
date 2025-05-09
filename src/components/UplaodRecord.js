import React, { useState } from 'react';
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const auth = 'Basic ' + Buffer.from(
  `${process.env.REACT_APP_INFURA_PROJECT_ID}:${process.env.REACT_APP_INFURA_PROJECT_SECRET}`
).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: { authorization: auth },
});

const UploadRecord = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !contract || !account) {
      toast.error("Missing file, contract, or wallet.");
      return;
    }

    try {
      setUploading(true);
      const result = await client.add(file);
      const ipfsHash = result.path;

      await contract.methods.uploadRecord(ipfsHash).send({ from: account });

      toast.success("Record uploaded to IPFS and saved on blockchain!");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload record.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h3>📄 Upload Medical Record</h3>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="form-control my-2"
      />
      <button
        className="btn btn-success"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload to IPFS"}
      </button>
    </div>
  );
};

export default UploadRecord;
