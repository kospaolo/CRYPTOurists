import { inject, Injectable } from '@angular/core';

import {
  contractABI
} from '../utils/constants';
import Web3 from 'web3';
import { ContractService } from './contract.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  #web3: Web3 | null = null;
  #provider: any;
  #contractService = inject(ContractService);


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
      const contract = new this.#web3.eth.Contract(contractABI, this.#contractService.getContractAddress());

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

      const contract = new this.#web3.eth.Contract(contractABI, this.#contractService.getContractAddress());
      const article = await contract.methods['getBooking'](articleId).call();

      console.log(`Booking Details for ID ${articleId}:`, article);
      return article;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  }

  async createArticle(name: any, business: any, price: any): Promise<any> {
    try {
      this.#web3 = new Web3((window as any).ethereum);
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const contract = new this.#web3.eth.Contract(contractABI, this.#contractService.getContractAddress());
      const formattedPrice = price * 1000;

      const gasLimit = 3000000;
      const result = await contract.methods['createArticle'](name, business, formattedPrice)
        .send({ from: accounts[0], gas: gasLimit.toString() });

      console.log('Article created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  async deleteArticle(article: any): Promise<any> {
    try {
      this.#web3 = new Web3((window as any).ethereum);
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const contract = new this.#web3.eth.Contract(contractABI, this.#contractService.getContractAddress());

      const gasEstimate = await contract.methods['deleteArticle'](article.id).estimateGas({ from: accounts[0] });
      const result = await contract.methods['deleteArticle'](article.id)
        .send({ from: accounts[0], gas: gasEstimate.toString() });

      console.log('Article deleted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }
}
