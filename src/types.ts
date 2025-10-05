export interface Coffee {
  id: string;
  name: string;
  description: string;
  price: string;
  emoji: string;
  image: string;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: string | null;
}

export interface TransactionResult {
  success: boolean;
  message: string;
  txHash?: string;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
