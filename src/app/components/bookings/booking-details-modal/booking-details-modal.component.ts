import {Component, inject, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {BookingService} from '../../../services/booking.service';
import {Web3} from 'web3';

@Component({
  selector: 'app-booking-details-modal',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButton,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    NgClass,
    DecimalPipe,
    NgForOf
  ],
  templateUrl: './booking-details-modal.component.html',
  styleUrl: './booking-details-modal.component.scss'
})
export class BookingDetailsModalComponent implements OnInit {
  #bookingService: BookingService = inject(BookingService);
  bookingArticles: any = [];

  constructor(
    public dialogRef: MatDialogRef<BookingDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  async ngOnInit() {
    this.bookingArticles = await this.#bookingService.getBookingArticles(this.data.id);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  generatePDF() {
    // Placeholder for PDF generation functionality
    console.log("Generating PDF for", this.data);
  }

  protected readonly parseFloat = parseFloat;
  protected readonly Web3 = Web3;
}
