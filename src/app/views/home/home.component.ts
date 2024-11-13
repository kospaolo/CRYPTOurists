import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import { BookingService } from '../../services/booking.service';
import { BookingDetailsModalComponent } from '../../components/bookings/booking-details-modal/booking-details-modal.component';
import {NgClass, SlicePipe, CurrencyPipe, DatePipe, DecimalPipe, NgIf} from '@angular/common';
import {adminAddresses, businessAddresses} from '../../utils/constants';
import {Web3} from 'web3';
import {MatButton} from '@angular/material/button';
import {CreateArticleModalComponent} from '../../components/articles/create-article-modal/create-article-modal.component';
import {
  CreateBookingModalComponent
} from '../../components/bookings/create-booking-modal/create-booking-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatTable,
    MatPaginator,
    NgClass,
    DatePipe,
    SlicePipe,
    CurrencyPipe,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    DecimalPipe,
    NgIf,
    MatButton
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  #dialog: MatDialog = inject(MatDialog);
  #bookingService: BookingService = inject(BookingService);

  bookings: any[] = [];
  displayedColumns: string[] = ['id', 'amount', 'operatorFee', 'timestamp', 'customer', 'status'];
  walletAddress: string | null = sessionStorage.getItem('wallet-address');ž

  isAdmin: boolean    = false;
  isBusiness: boolean = false;

  async ngOnInit() {
    this.checkIfBusiness();
    await this.fetchBookings();
  }

  checkIfBusiness() {
    if (this.walletAddress) {
      this.isAdmin = adminAddresses
        .map(address => address.toLowerCase())
        .includes(this.walletAddress.toLowerCase());

      this.isBusiness = businessAddresses
        .map(address => address.toLowerCase())
        .includes(this.walletAddress.toLowerCase());
    }
  }

  // Fetch bookings and apply business filtering if necessary
  async fetchBookings() {
    try {
      const rawData = await this.#bookingService.getAllBookings();
      const allBookings = this.transformData(rawData);
      this.bookings = this.isBusiness && this.walletAddress
        ? allBookings.filter(booking => booking.customer.toLowerCase() === this.walletAddress.toLowerCase() || booking.payer.toLowerCase() === this.walletAddress.toLowerCase())
        : allBookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }

  transformData(rawData: any) {
    const ids = rawData.ids || rawData[0];
    const amounts = rawData.amounts || rawData[1];
    const operatorFees = rawData.operatorFees || rawData[2];
    const timestamps = rawData.timestamps || rawData[3];
    const customers = rawData.customers || rawData[4];
    const payers = rawData.payers || rawData[5];
    const paidStatus = rawData.paidStatus || rawData[6];
    const completedStatus = rawData.completedStatus || rawData[7];
    const refundedStatus = rawData.refundedStatus || rawData[8];

    return ids.map((id: any, index: number) => ({
      id: Number(id),
      totalAmount: parseFloat(Web3.utils.fromWei(amounts[index], 'ether')),
      operatorFee: parseFloat(Web3.utils.fromWei(operatorFees[index], 'ether')),
      timestamp: new Date(Number(timestamps[index]) * 1000),
      customer: customers[index],
      payer: payers[index],
      isPaid: Boolean(paidStatus[index]),
      isCompleted: Boolean(completedStatus[index]),
      isRefunded: Boolean(refundedStatus[index]),
    }));
  }

  openDetailsBookingModal(booking: any) {
    const dialogRef = this.#dialog.open(BookingDetailsModalComponent, {
      data: booking,
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Booking modal closed');
    });
  }

  openCreateBookingModal() {
    const dialogRef = this.#dialog.open(CreateBookingModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.fetchBookings();
      }
    });
  }
}
