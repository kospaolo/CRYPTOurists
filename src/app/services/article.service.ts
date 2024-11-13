import { Injectable } from '@angular/core';

import {
  contractABI,
  contractAddress
} from '../utils/constants';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  #web3: Web3 | null = null;
  #provider: any;

  constructor() {
    this.#provider = new Web3.providers.HttpProvider('https://columbus.camino.network/ext/bc/C/rpc');
    this.#web3 = new Web3(this.#provider);
  }

  // Fetch all articles from the smart contract
  async getAllArticles(): Promise<any> {
    try {
      if (!this.#web3) {
        console.error('Web3 not initialized');
        return;
      }
      const contract = new this.#web3.eth.Contract(contractABI, contractAddress);

      return await contract.methods['getAllArticles']().call();
    } catch (error) {
      console.error('Error fetching articles:', error);
      return null;
    }
  }

  async getArticle(articleId: number): Promise<any> {
    try {
      if (!this.#web3) {
        console.error('Web3 not initialized');
        return;
      }

      const contract = new this.#web3.eth.Contract(contractABI, contractAddress);
      const article = await contract.methods['getBooking'](articleId).call();

      console.log(`Booking Details for ID ${articleId}:`, article);
      return article;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  }

  async createArticle(name: any, business: any, price: any): Promise<void> {
    try {
      this.#web3 = new Web3((window as any).ethereum);
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const contract = new this.#web3.eth.Contract(contractABI, contractAddress);
      const gasLimit = 3000000;
      const result = await contract.methods['createArticle'](name, business, price)
        .send({ from: accounts[0], gas: gasLimit.toString() });

      console.log('Article created successfully:', result);
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

}
