declare global {
  interface Window {
    ethereum: any;
  }
}

import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { contractABI, contractBytecode } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  // Dummy bytecode - replace with actual bytecode
  private readonly BYTECODE = contractBytecode;

  async deployContract(operatorFee: number): Promise<string> {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const factory = new ethers.ContractFactory(
        contractABI,
        this.BYTECODE,
        signer
      );

      // Multiply operator fee by 100 to handle decimals
      const adjustedOperatorFee = operatorFee * 100;
      const contract = await factory.deploy(adjustedOperatorFee);
      await contract.waitForDeployment();
      
      const address = await contract.getAddress();
      localStorage.setItem('contract-address', address);
      console.log("Contract address:", address);
      
      return address;
    } catch (error) {
      console.error('Error deploying contract:', error);
      throw error;
    }
  }

  getContractAddress(): string {
    return localStorage.getItem('contract-address');
  }
} 