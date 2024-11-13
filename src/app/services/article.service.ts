import { Injectable } from '@angular/core';
import {Article} from '../models/article.model';
import {ARTICLES} from '../data/articles.data';
import {bookingContractABI, bookingContractAddress} from '../utils/constants';
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
    /*    try {
          if (!this.#web3) {
            console.error('Web3 not initialized');
            return;
          }

          const contract = new this.#web3.eth.Contract(bookingContractABI, bookingContractAddress);

          // Call the smart contract function to get all bookings
          const bookings = await contract.methods['getAllBookings']().call();
          return bookings;
        } catch (error) {
          console.error('Error fetching bookings:', error);
          return null;
        }*/
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
}
