import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BookingService } from '../../services/booking.service';
import { BookingDetailsModalComponent } from '../../components/booking-details-modal/booking-details-modal.component';
import { NgClass, SlicePipe, CurrencyPipe, DatePipe } from '@angular/common';
import {businessAddresses} from '../../utils/constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatTable,
    MatPaginator,
    NgClass,
    DatePipe,
    SlicePipe,
    CurrencyPipe
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  #dialog: MatDialog = inject(MatDialog);
  #bookingService: BookingService = inject(BookingService);

  bookings: any[] = [];
  displayedColumns: string[] = ['bookingId', 'totalAmount', 'operatorFee', 'timestamp', 'customer', 'status', 'articleCount'];
  isBusiness: boolean = false;
  walletAddress: string | null = sessionStorage.getItem('wallet-address');

  async ngOnInit() {
    this.checkIfBusiness();
    await this.fetchBookings();
  }

  // Check if the user is a business based on the wallet address
  checkIfBusiness() {
    if (this.walletAddress && businessAddresses.includes(this.walletAddress.toLowerCase())) {
      this.isBusiness = true;
    }
  }

  // Fetch bookings and apply business filtering if necessary
  async fetchBookings() {
    try {
      const allBookings = await this.#bookingService.getAllBookings();

      // Filter bookings for business users to only show their own bookings
      this.bookings = this.isBusiness && this.walletAddress
        ? allBookings.filter(booking => booking.customer.toLowerCase() === this.walletAddress.toLowerCase())
        : allBookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }

  openBookingModal(booking: any) {
    const dialogRef = this.#dialog.open(BookingDetailsModalComponent, {
      data: booking,
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Booking modal closed');
    });
  }
}
