// src/blockchain.ts
import { ethers } from 'ethers';
import factoryJson from './StorageFactory.json';

export class StorageFactoryService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  public contract: ethers.Contract | null = null;

  async connect(): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    
    const factoryAddress = '0x3B750d93970f42b6D08d6e8Ea7544Fb536C9927b';
    this.contract = new ethers.Contract(factoryAddress, factoryJson.abi, this.signer);
  }

  // Debug function to check contract state
  async debugContractState(): Promise<any> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    try {
      // Check how many storage contracts exist
      let contractCount = 0;
      let hasContracts = true;
      
      // Try to find the maximum existing index
      while (hasContracts && contractCount < 100) { // Reasonable limit
        try {
          const address = await this.contract.listOfSimpleStorageContracts(contractCount);
          if (address === '0x0000000000000000000000000000000000000000') {
            hasContracts = false;
          } else {
            contractCount++;
          }
        } catch (error) {
          hasContracts = false;
        }
      }

      console.log(`Found ${contractCount} existing storage contracts`);
      
      // Check current values for existing contracts
      const values = [];
      for (let i = 0; i < contractCount; i++) {
        try {
          const value = await this.contract.sfGet(i);
          values.push({ index: i, value: value.toString() });
        } catch (error) {
          values.push({ index: i, value: 'Error reading' });
        }
      }

      return {
        totalContracts: contractCount,
        existingValues: values
      };
    } catch (error) {
      console.error('Debug error:', error);
      throw error;
    }
  }

  async getStoredValue(index: number = 0): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }
    
    try {
      // First, debug to see what indexes are available
      const debugInfo = await this.debugContractState();
      console.log('Debug info:', debugInfo);

      if (index >= debugInfo.totalContracts) {
        throw new Error(`Index ${index} doesn't exist. Only ${debugInfo.totalContracts} storage contracts created.`);
      }

      const value = await this.contract.sfGet(index);
      return value.toString();
    } catch (error: any) {
      if (error.reason?.includes('ARRAY_RANGE_ERROR') || error.code === 'CALL_EXCEPTION') {
        throw new Error(`Storage contract at index ${index} doesn't exist yet. Create it first.`);
      }
      throw error;
    }
  }

  async setStoredValue(index: number, value: number): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }
    
    try {
      // Check if the contract exists before trying to set
      const debugInfo = await this.debugContractState();
      
      if (index >= debugInfo.totalContracts) {
        throw new Error(`Cannot set value: Storage contract at index ${index} doesn't exist. Create it first.`);
      }

      const tx = await this.contract.sfStore(index, value);
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      if (error.reason?.includes('ARRAY_RANGE_ERROR') || error.code === 'CALL_EXCEPTION') {
        throw new Error(`Storage contract at index ${index} doesn't exist. Create it first.`);
      }
      throw error;
    }
  }

  async createNewStorage(): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }
    
    try {
      const tx = await this.contract.createSimpleStorageContract();
      await tx.wait();
      
      // Return the new contract index
      const debugInfo = await this.debugContractState();
      return `New storage contract created at index ${debugInfo.totalContracts - 1}`;
    } catch (error) {
      console.error('Create storage error:', error);
      throw error;
    }
  }

  async getTotalStorageContracts(): Promise<number> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    const debugInfo = await this.debugContractState();
    return debugInfo.totalContracts;
  }
}

export const storageFactoryService = new StorageFactoryService();