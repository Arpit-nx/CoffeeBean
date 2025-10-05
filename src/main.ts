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

const CAFE_WALLET_ADDRESS = '0x70C8de2fca710c9a9dA4Eac343a0CA4DBDE387fe';

const connectButton = document.getElementById('connectButton') as HTMLButtonElement;
const disconnectButton = document.getElementById('disconnectButton') as HTMLButtonElement;
const balanceButton = document.getElementById('balanceButton') as HTMLButtonElement;
const balanceDisplay = document.getElementById('balanceDisplay') as HTMLElement;
const balanceAmount = document.getElementById('balanceAmount') as HTMLElement;
const profileSection = document.getElementById('profileSection') as HTMLElement;
const walletAddressEl = document.getElementById('walletAddress') as HTMLElement;
const menuGrid = document.getElementById('menuGrid') as HTMLElement;
const modalClose = document.getElementById('modalClose') as HTMLButtonElement;

const updateUI = () => {
  const state = getWalletState();

  if (state.connected && state.address) {
    connectButton.style.display = 'none';
    disconnectButton.style.display = 'flex';
    profileSection.style.display = 'block';
    walletAddressEl.textContent = formatAddress(state.address);
    pulseElement(profileSection);
  } else {
    connectButton.style.display = 'flex';
    disconnectButton.style.display = 'none';
    profileSection.style.display = 'none';
    balanceDisplay.style.display = 'none';
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
    updateUI();

    showTransactionModal(
      true,
      'Wallet Connected!',
      'Your wallet has been successfully connected.'
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

connectButton.addEventListener('click', handleConnect);
disconnectButton.addEventListener('click', handleDisconnect);
balanceButton.addEventListener('click', handleBalance);
modalClose.addEventListener('click', hideTransactionModal);

renderMenu(menuGrid, handleBuyCoffee);

showEntranceAnimation();
updateUI();
