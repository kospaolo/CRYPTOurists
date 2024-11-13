import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-booking-details-modal',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButton,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions
  ],
  templateUrl: './booking-details-modal.component.html',
  styleUrl: './booking-details-modal.component.scss'
})
export class BookingDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<BookingDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  generatePDF(transaction: any) {
    // Placeholder for PDF generation functionality
    console.log("Generating PDF for", this.data);
  }
}
