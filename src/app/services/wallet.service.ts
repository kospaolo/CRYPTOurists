import { Injectable } from '@angular/core';
import {Web3} from 'web3';

@Injectable({
  providedIn: 'root'
})

export class WalletService {
  #web3: Web3 | undefined;
  #account: string | null = null;

  constructor() {
    const ethereum = (window as any).ethereum;
    if (typeof ethereum !== 'undefined') {
      this.#web3 = new Web3(ethereum);

      // Detect account or network changes
      ethereum.on('accountsChanged', (accounts: string[]) => {
        this.#account = accounts.length > 0 ? accounts[0] : null;
      });

      ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    } else {
      console.error('MetaMask is not installed!');
    }
  }

  async connectWallet(): Promise<string | null> {
    const ethereum = (window as any).ethereum;
    if (!this.#web3) {
      alert('Please install MetaMask to use this feature.');
      return null;
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      this.#account = accounts[0];
      return this.#account;
    } catch (error) {
      console.error('User rejected the request.');
      return null;
    }
  }

  getAccount(): string | null {
    return this.#account;
  }
}
