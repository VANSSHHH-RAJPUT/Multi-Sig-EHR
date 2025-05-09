import { ethers } from "ethers";
import contractABI from "../artifacts/contracts/MultiSigEHR.sol/MultiSigEHR.json";

// ✅ Your current contract address
const contractAddress = "0x329141ce6bc3769801Ba0644c82c6Cd8a43AE3d1";

// Load and return contract instance
const loadContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask is not installed!");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI.abi, signer);
};

export default loadContract;
