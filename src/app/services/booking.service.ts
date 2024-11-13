import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { bookingContractABI, bookingContractAddress } from '../utils/constants';

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

  async getBooking(bookingId: number): Promise<any> {
    try {
      if (!this.#web3) {
        console.error('Web3 not initialized');
        return;
      }

      const contract = new this.#web3.eth.Contract(bookingContractABI, bookingContractAddress);

      // Call the contract function with the bookingId parameter
      const booking = await contract.methods['getBooking'](bookingId).call();

      console.log(`Booking Details for ID ${bookingId}:`, booking);

      // Optionally, you can structure the output data
/*      const formattedBooking = {
        totalAmount: this.#web3.utils.fromWei(booking.totalAmount, 'ether'),
        operatorFee: this.#web3.utils.fromWei(booking.operatorFee, 'ether'),
        timestamp: new Date(booking.timestamp * 1000),
        customer: booking.customer,
        isCompleted: booking.isCompleted,
        isRefunded: booking.isRefunded,
        articleCount: booking.articleCount,
      };

      console.log('Formatted Booking:', formattedBooking);*/

      return booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return null;
    }
  }
}
