import {Component, inject, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {BookingService} from '../../../services/booking.service';
import {Web3} from 'web3';
import {PinataService} from '../../../services/pdf.service';

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
    NgForOf,
    NgIf
  ],
  templateUrl: './booking-details-modal.component.html',
  styleUrl: './booking-details-modal.component.scss'
})
export class BookingDetailsModalComponent implements OnInit {
  #bookingService: BookingService = inject(BookingService);
  #pinataService: PinataService = inject(PinataService);
  bookingArticles: any = [];

  pdfData = {
      bookingId: 0,
      customerAddress: '0x00',
      payerAddress: '0x00',
      totalAmount: 0,
      operatorFee: 0.00,
      status: '',
      paid: '',
      articles: [
        {
          articleName: '',
          businessAddress: '0x00',
          price: 0,
          activeStatus: ''
        },
      ]
  };
  status: string  = '';
  ipfsUrl: string = '';
  isUploading: boolean = false;

  pinataUrl: string = 'https://harlequin-abundant-jaguar-168.mypinata.cloud/ipfs/';

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

  async generateAndPreview() {
    /*this.pdfData = {
      bookingId: this.data.id,
      customerAddress: this.data.customer,
      payerAddress: this.data.payer,
      totalAmount: this.data.totalAmount,
      operatorFee: this.data.operatorFee,
      status: this.data.isCompleted ? 'Completed' : this.data.isRefunded ? 'Refunded' : this.data.isPaid ? 'Paid' : 'Pending',
      paid: this.data.isPaid ? 'Paid' : 'Unpaid',
      articles: this.bookingArticles.map(article => ({
        articleName: article.name,
        businessAddress: article.business,
        price: article.price,
        activeStatus: article.isActive ? 'Active' : 'Inactive'
      }))
    }*/

    const pdfFile = this.#pinataService.generatePDF(this.pdfData);
    const url = URL.createObjectURL(await pdfFile);
    window.open(url, '_blank');
  }

  generateAndUpload() {
    this.isUploading = true;
    this.status = 'Generating PDF and uploading to IPFS...';

    this.pdfData = {
      bookingId: this.data.id,
      customerAddress: this.data.customer,
      payerAddress: this.data.payer,
      totalAmount: this.data.totalAmount,
      operatorFee: this.data.operatorFee,
      status: this.data.isCompleted ? 'Completed' : this.data.isRefunded ? 'Refunded' : 'Pending',
      paid: this.data.isPaid ? 'Paid' : 'Unpaid',
      articles: this.bookingArticles.map(article => ({
        articleName: article.name,
        businessAddress: article.business,
        price: article.price,
        activeStatus: article.isActive ? 'Active' : 'Inactive'
      }))
    }

    this.#pinataService.generateAndUpload(this.pdfData).subscribe({
      next: (response) => {
        this.isUploading = false;
        if (response.success) {
          this.status = 'Upload successful!';
          this.ipfsUrl = response.gatewayURL;
          const hash = response.ipfsHash;
          const link = this.pinataUrl + hash;
          window.open(link, '_blank');
          //this.generateAndPreview();
        } else {
          this.status = 'Error: ' + response.error;
        }
      },
      error: (error) => {
        this.isUploading = false;
        this.status = 'Error: ' + error.message;
      }
    });
  }

  protected readonly parseFloat = parseFloat;
  protected readonly Web3 = Web3;
}
