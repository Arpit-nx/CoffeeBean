import type { WalletState } from './types';

let walletState: WalletState = {
  connected: false,
  address: null,
  balance: null
};

export const getWalletState = (): WalletState => walletState;

export const checkMetaMaskInstalled = (): boolean => {
  return typeof window.ethereum !== 'undefined';
};

export const connectWallet = async (): Promise<string> => {
  if (!checkMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    const address = accounts[0];
    walletState.connected = true;
    walletState.address = address;

    return address;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to connect wallet');
  }
};

export const disconnectWallet = (): void => {
  walletState.connected = false;
  walletState.address = null;
  walletState.balance = null;
};

export const getBalance = async (): Promise<string> => {
  if (!walletState.connected || !walletState.address) {
    throw new Error('Wallet not connected');
  }

  try {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [walletState.address, 'latest']
    });

    const ethBalance = parseInt(balance, 16) / 1e18;
    const formattedBalance = ethBalance.toFixed(4);
    walletState.balance = formattedBalance;

    return formattedBalance;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get balance');
  }
};

export const sendTransaction = async (toAddress: string, amount: string): Promise<string> => {
  if (!walletState.connected || !walletState.address) {
    throw new Error('Wallet not connected');
  }

  try {
    const amountInWei = '0x' + Math.floor(parseFloat(amount) * 1e18).toString(16);

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: walletState.address,
        to: toAddress,
        value: amountInWei,
      }]
    });

    return txHash;
  } catch (error: any) {
    throw new Error(error.message || 'Transaction failed');
  }
};

export const formatAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};
