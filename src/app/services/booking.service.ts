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
      this.#web3 = new Web3((window as any).ethereum);
      const contract = new this.#web3.eth.Contract(contractABI, contractAddress);
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

      const result = await contract.methods
        ['createBooking'](articles, customerAddress)
        .send({ from: accounts[0] });
      console.log('Booking created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating booking:', error);
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

  async confirmBooking(booking: any): Promise<any> {
    try {
      this.#web3 = new Web3((window as any).ethereum);
      const contract = new this.#web3.eth.Contract(contractABI, contractAddress);
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

      const gasEstimate = await contract.methods['completePayment'](booking.id).estimateGas({ from: accounts[0] });
      const result = await contract.methods
        ['completePayment'](booking.id)
        .send({ from: accounts[0], gas: gasEstimate.toString() });
      console.log('Booking paid successfully:', result);
      return result;
    } catch (error) {
      console.error('Error accepting booking:', error);
      throw error;
    }
  }

  async refundPayment(booking: any): Promise<any> {
    try {
      this.#web3 = new Web3((window as any).ethereum);
      const contract = new this.#web3.eth.Contract(contractABI, contractAddress);
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

      const gasEstimate = await contract.methods['refundPayment'](booking.id).estimateGas({ from: accounts[0] });
      const result = await contract.methods
        ['refundPayment'](booking.id)
        .send({ from: accounts[0], gas: gasEstimate.toString() });
      console.log('Booking refunded successfully:', result);

      return result;
    } catch (error) {
      console.error('Error refunding booking:', error);
      throw error;
    }
  }

  async getOperatorFeePercentage(): Promise<any> {
    try {
      const contract = new this.#web3.eth.Contract(contractABI, contractAddress);
      return await contract.methods['operatorFeePercentage']().call();
    } catch (error) {
      console.error('Error fetching bookingArticles:', error);
      throw error;
    }
  }
}
