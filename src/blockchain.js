import { ethers } from 'ethers';
import factoryJson from './StorageFactory.json';  // your JSON file

// Connect to MetaMask
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Your deployed contract address
const factoryAddress = '0xDa87801852A773450f27e235a2d7fB1eb146f478';

const factoryABI = factoryJson.abi;

const factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);

const value = await factoryContract.sfGet(0); // view function, safe
console.log("Stored value:", value.toString());

export { factoryContract };
