import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { contractABI, contractAddress } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  #web3: Web3 | null = null;
  #provider: any;

  constructor() {
    this.#provider = new Web3.providers.HttpProvider('https://columbus.camino.network/ext/bc/C/rpc');
    this.#web3 = new Web3(this.#provider);
  }

  // Fetch all bookings from the smart contract
  async getAllBookings(): Promise<any> {
    try {
      if (!this.#web3) {
        console.error('Web3 not initialized');
        return;
      }
      const contract = new this.#web3.eth.Contract(contractABI, contractAddress);
      return await contract.methods['getAllBookings']().call();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return null;
    }
  }

  async createBooking(customerAddress: any, articles: any): Promise<any> {
    try {
      const contract = new this.#web3.eth.Contract(contractABI, contractAddress);
      const result = await contract.methods['createBooking'](articles, customerAddress);

      console.log('Booking created successfully:', result);
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  async getBookingArticles(bookingId: any): Promise<any> {
    try {
      const contract = new this.#web3.eth.Contract(contractABI, contractAddress);
      return await contract.methods['getBookingArticles'](bookingId).call();
    } catch (error) {
      console.error('Error fetching bookingArticles:', error);
      throw error;
    }
  }
}