// src/main.ts
import './style.css';
import {
  connectWallet,
  disconnectWallet,
  getBalance,
  sendTransaction,
  formatAddress,
  checkMetaMaskInstalled,
  getWalletState
} from './wallet';
import { renderMenu } from './menu';
import {
  showEntranceAnimation,
  showTransactionModal,
  hideTransactionModal,
  pulseElement,
  shakeElement
} from './animations';
import type { Coffee } from './types';
import { storageFactoryService } from './blockchain';

const CAFE_WALLET_ADDRESS = '0x70C8de2fca710c9a9dA4Eac343a0CA4DBDE387fe';

// DOM Elements
const connectButton = document.getElementById('connectButton') as HTMLButtonElement;
const disconnectButton = document.getElementById('disconnectButton') as HTMLButtonElement;
const balanceButton = document.getElementById('balanceButton') as HTMLButtonElement;
const balanceDisplay = document.getElementById('balanceDisplay') as HTMLElement;
const balanceAmount = document.getElementById('balanceAmount') as HTMLElement;
const profileSection = document.getElementById('profileSection') as HTMLElement;
const walletAddressEl = document.getElementById('walletAddress') as HTMLElement;
const menuGrid = document.getElementById('menuGrid') as HTMLElement;
const modalClose = document.getElementById('modalClose') as HTMLButtonElement;
const contractSection = document.getElementById('contractSection') as HTMLElement;
const getValueBtn = document.getElementById('getValueBtn') as HTMLButtonElement;
const setValueBtn = document.getElementById('setValueBtn') as HTMLButtonElement;
const createStorageBtn = document.getElementById('createStorageBtn') as HTMLButtonElement;
const storedValueDisplay = document.getElementById('storedValue') as HTMLElement;
const valueIndexInput = document.getElementById('valueIndex') as HTMLInputElement;
const newValueInput = document.getElementById('newValue') as HTMLInputElement;

const updateUI = () => {
  const state = getWalletState();

  if (state.connected && state.address) {
    connectButton.style.display = 'none';
    disconnectButton.style.display = 'flex';
    profileSection.style.display = 'block';
    contractSection.style.display = 'block';
    walletAddressEl.textContent = formatAddress(state.address);
    pulseElement(profileSection);
  } else {
    connectButton.style.display = 'flex';
    disconnectButton.style.display = 'none';
    profileSection.style.display = 'none';
    balanceDisplay.style.display = 'none';
    contractSection.style.display = 'none';
  }
};

const handleConnect = async () => {
  try {
    if (!checkMetaMaskInstalled()) {
      showTransactionModal(
        false,
        'MetaMask Not Found',
        'Please install MetaMask extension to connect your wallet.'
      );
      return;
    }

    connectButton.disabled = true;
    connectButton.textContent = 'Connecting...';

    await connectWallet();
    await storageFactoryService.connect(); // Connect contract too
    updateUI();

    showTransactionModal(
      true,
      'Wallet Connected!',
      'Your wallet and smart contract have been successfully connected.'
    );
  } catch (error: any) {
    showTransactionModal(
      false,
      'Connection Failed',
      error.message || 'Failed to connect wallet'
    );
  } finally {
    connectButton.disabled = false;
    connectButton.innerHTML = '<span class="btn-icon">🔗</span> Connect Wallet';
  }
};

const handleDisconnect = () => {
  disconnectWallet();
  updateUI();
  showTransactionModal(
    true,
    'Wallet Disconnected',
    'Your wallet has been disconnected.'
  );
};

const handleBalance = async () => {
  try {
    balanceButton.disabled = true;
    balanceButton.textContent = 'Loading...';

    const balance = await getBalance();
    balanceAmount.textContent = `${balance} ETH`;
    balanceDisplay.style.display = 'block';
    pulseElement(balanceDisplay);
  } catch (error: any) {
    showTransactionModal(
      false,
      'Error',
      error.message || 'Failed to get balance'
    );
  } finally {
    balanceButton.disabled = false;
    balanceButton.innerHTML = '<span class="btn-icon">💰</span> Show Balance';
  }
};

// src/main.ts (updated parts)
const handleGetValue = async () => {
  try {
    getValueBtn.disabled = true;
    getValueBtn.textContent = 'Loading...';

    const index = parseInt(valueIndexInput.value) || 0;
    
    // Get total contracts first
    const totalContracts = await storageFactoryService.getTotalStorageContracts();
    
    if (totalContracts === 0) {
      showTransactionModal(
        false,
        'No Storage Contracts',
        'No storage contracts found. Please create one first.'
      );
      return;
    }

    if (index >= totalContracts) {
      showTransactionModal(
        false,
        'Invalid Index',
        `Index ${index} doesn't exist. Only ${totalContracts} storage contract(s) available. Valid indexes: 0-${totalContracts - 1}`
      );
      return;
    }

    const value = await storageFactoryService.getStoredValue(index);
    
    storedValueDisplay.textContent = value;
    storedValueDisplay.className = 'value-display success';
    storedValueDisplay.style.display = 'block';
    pulseElement(storedValueDisplay);

    showTransactionModal(
      true,
      'Value Retrieved',
      `Stored value at index ${index}: ${value}`
    );
  } catch (error: any) {
    storedValueDisplay.className = 'value-display error';
    storedValueDisplay.textContent = 'Error';
    showTransactionModal(
      false,
      'Read Failed',
      error.message || 'Failed to read from contract'
    );
  } finally {
    getValueBtn.disabled = false;
    getValueBtn.innerHTML = '<span class="btn-icon">📖</span> Read Value';
  }
};

const handleSetValue = async () => {
  try {
    setValueBtn.disabled = true;
    setValueBtn.textContent = 'Setting...';

    const index = parseInt(valueIndexInput.value) || 0;
    const value = parseInt(newValueInput.value);

    if (isNaN(value)) {
      throw new Error('Please enter a valid number');
    }

    // Check if contract exists first
    const totalContracts = await storageFactoryService.getTotalStorageContracts();
    
    if (index >= totalContracts) {
      throw new Error(`Index ${index} doesn't exist. Create storage contract first or use index 0-${totalContracts - 1}`);
    }

    const txHash = await storageFactoryService.setStoredValue(index, value);

    showTransactionModal(
      true,
      'Value Set!',
      `Successfully set value ${value} at index ${index}\nTransaction: ${txHash.substring(0, 10)}...`
    );

    // Refresh the displayed value
    await handleGetValue();
  } catch (error: any) {
    showTransactionModal(
      false,
      'Set Value Failed',
      error.message || 'Failed to set value'
    );
  } finally {
    setValueBtn.disabled = false;
    setValueBtn.innerHTML = '<span class="btn-icon">💾</span> Set Value';
  }
};

const handleCreateStorage = async () => {
  try {
    createStorageBtn.disabled = true;
    createStorageBtn.textContent = 'Creating...';

    const result = await storageFactoryService.createNewStorage();

    showTransactionModal(
      true,
      'Storage Created!',
      result
    );

    // Update the UI to show available indexes
    updateContractInfo();
  } catch (error: any) {
    showTransactionModal(
      false,
      'Creation Failed',
      error.message || 'Failed to create storage contract'
    );
  } finally {
    createStorageBtn.disabled = false;
    createStorageBtn.innerHTML = '<span class="btn-icon">🆕</span> Create Storage';
  }
};

// New function to update contract info display
const updateContractInfo = async () => {
  try {
    const totalContracts = await storageFactoryService.getTotalStorageContracts();
    const contractInfo = document.querySelector('.contract-info');
    
    if (contractInfo) {
      const infoItem = contractInfo.querySelector('.info-item:nth-child(3)');
      if (infoItem) {
        infoItem.innerHTML = `
          <span class="info-label">Available Indexes:</span>
          <span class="info-value">0-${totalContracts - 1}</span>
        `;
      }
    }
  } catch (error) {
    console.error('Failed to update contract info:', error);
  }
};

const handleBuyCoffee = async (coffee: Coffee) => {
  const state = getWalletState();

  if (!state.connected) {
    showTransactionModal(
      false,
      'Wallet Not Connected',
      'Please connect your wallet before making a purchase.'
    );
    shakeElement(connectButton);
    return;
  }

  try {
    showTransactionModal(
      true,
      'Processing Transaction',
      `Purchasing ${coffee.name} for ${coffee.price} ETH...`
    );

    const txHash = await sendTransaction(CAFE_WALLET_ADDRESS, coffee.price);

    hideTransactionModal();

    setTimeout(() => {
      showTransactionModal(
        true,
        'Purchase Successful!',
        `Your ${coffee.name} has been purchased! Enjoy your coffee ☕\n\nTransaction: ${txHash.substring(0, 10)}...`
      );
    }, 300);

  } catch (error: any) {
    hideTransactionModal();

    setTimeout(() => {
      showTransactionModal(
        false,
        'Transaction Failed',
        error.message || 'Failed to complete the transaction'
      );
    }, 300);
  }
};

// Event Listeners
connectButton.addEventListener('click', handleConnect);
disconnectButton.addEventListener('click', handleDisconnect);
balanceButton.addEventListener('click', handleBalance);
getValueBtn.addEventListener('click', handleGetValue);
setValueBtn.addEventListener('click', handleSetValue);
createStorageBtn.addEventListener('click', handleCreateStorage);
modalClose.addEventListener('click', hideTransactionModal);

// Initialize
renderMenu(menuGrid, handleBuyCoffee);
showEntranceAnimation();
updateUI();