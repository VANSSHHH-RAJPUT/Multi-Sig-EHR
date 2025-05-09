import { ethers } from "ethers";
import contractABI from "../artifacts/contracts/MultiSigEHR.sol/MultiSigEHR.json";

// ✅ Replace this with your actual deployed contract address on Sepolia
const contractAddress = "0x166E0e2d3A5393ef5d2a8590e37aA3077978e67f";

// ✅ Function to load and return the contract instance
const loadContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed!");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

  return contract;
};

export default loadContract;
