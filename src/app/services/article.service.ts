import { Injectable } from '@angular/core';
import {Article} from '../models/article.model';
import {ARTICLES} from '../data/articles.data';
import {
  articleContractABI,
  articleContractAddress,
  bookingContractABI,
  bookingContractAddress
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

  getArticles(): Article[] {
    return ARTICLES;
  }

  async getAllArticles(): Promise<any> {
        try {
          if (!this.#web3) {
            console.error('Web3 not initialized');
            return;
          }

          const contract = new this.#web3.eth.Contract(articleContractABI, articleContractAddress);

          // Call the smart contract function to get all bookings
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

      const contract = new this.#web3.eth.Contract(bookingContractABI, bookingContractAddress);
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
      // Request the user's account (wallet address) from Web3
      const accounts = await this.#web3.eth.requestAccounts();
      const account = accounts[0]; // Use the first account available

      // Convert price to the correct format if needed (e.g., converting to Wei if price represents Ether)
      const formattedPrice: any = this.#web3.utils.toWei(price.toString(), 'ether');

      // Call the smart contract's createArticle function
      const contract = new this.#web3.eth.Contract(bookingContractABI, bookingContractAddress);
      const result = await contract.methods['createArticle'](name, business, formattedPrice).send({
        from: account,
      });

      console.log('Article created successfully:', result);
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }
}
