# ☕ CoffeeBean — Your First Step into Web3!

<p align="center">
  <img src="https://github.com/Arpit-nx/CoffeeBean/assets/placeholder-coffee-banner.png" alt="CoffeeBean Banner" width="80%">
</p>

<p align="center">
  <b>☕ A decentralized app (DApp) built on Ethereum that lets users buy me a coffee using crypto!</b>  
</p>

<p align="center">
  <a href="https://soliditylang.org/"><img src="https://img.shields.io/badge/Solidity-^0.8.0-black?logo=solidity&logoColor=white" /></a>
  <a href="https://ethereum.org/"><img src="https://img.shields.io/badge/Ethereum-Mainnet-blue?logo=ethereum" /></a>
  <a href="https://metamask.io/"><img src="https://img.shields.io/badge/Metamask-Enabled-orange?logo=metamask" /></a>
  <a href="https://hardhat.org/"><img src="https://img.shields.io/badge/Built%20With-Hardhat-yellow" /></a>
</p>

---

## 🌟 Overview

**CoffeeBean** is a fun and simple **Web3 DApp** that allows anyone to send you a “coffee” ☕ — a small Ethereum tip — as a token of appreciation.  
It’s built using **Solidity**, **Hardhat**, and **Ethers.js**, and deployed on an Ethereum test network.

The project is designed to be a **hands-on introduction to smart contracts**, **blockchain payments**, and **decentralized app development**.

---

## 🛠️ Tech Stack

| Layer | Technology Used |
|-------|------------------|
| **Smart Contract** | Solidity |
| **Blockchain Network** | Ethereum / Sepolia Testnet |
| **Framework** | Hardhat |
| **Frontend** | HTML, CSS, JavaScript (Ethers.js) |
| **Wallet** | MetaMask |
| **Deployment** | GitHub + Hardhat Local/Testnet |

---

## 🚀 Features

✅ Send ETH as a “Coffee” (tip) directly on-chain  
✅ Transparent transaction records  
✅ Wallet connection via MetaMask  
✅ Smart contract built with Solidity  
✅ Easy-to-understand codebase — perfect for beginners  
✅ Deployed and verified on testnet  

---

## 📸 Preview

<p align="center">
  <img src="https://github.com/Arpit-nx/CoffeeBean/assets/placeholder-coffee-banner.png" alt="CoffeeBean Screenshot" width="80%">
  <img src="https://github.com/Arpit-nx/CoffeeBean/assets/deployment.png" alt="Deployment Screenshot" width="80%">
</p>

---

## 🧩 Project Structure

CoffeeBean/
│
├── contracts/ # Solidity/Vyper smart contracts
│ └── Coffee.sol
│
├── scripts/ # Deployment & interaction scripts
│ └── deploy.js
│
├── frontend/ # Simple HTML + JS UI
│ ├── index.html
│ └── app.js
│
├── hardhat.config.js # Hardhat setup
└── README.md


---

## 🧠 Smart Contract Logic

The contract allows users to send a tip (in ETH) with a name and message.  
Each transaction stores:
- Sender’s address  
- Name & message  
- Timestamp  

```solidity
function buyCoffee(string memory _name, string memory _message) public payable {
    require(msg.value > 0, "Can't buy coffee for free!");
    memos.push(Memo(msg.sender, block.timestamp, _name, _message));
}
