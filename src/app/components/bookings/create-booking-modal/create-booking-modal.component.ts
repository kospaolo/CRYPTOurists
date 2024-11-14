import { Component, inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ArticleService } from '../../../services/article.service';
import { BookingService } from '../../../services/booking.service';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import Web3 from 'web3';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-create-booking-modal',
  standalone: true,
  templateUrl: './create-booking-modal.component.html',
  styleUrls: ['./create-booking-modal.component.scss'],
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatLabel
  ]
})
export class CreateBookingModalComponent implements OnInit {
  #articleService: ArticleService = inject(ArticleService);
  #bookingService: BookingService = inject(BookingService);

  bookingForm: FormGroup;
  articles: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateBookingModalComponent>
  ) {
    this.bookingForm = this.fb.group({
      customerAddress: ['', Validators.required],
      articles: [[], Validators.required]
    });
  }

  async ngOnInit() {
    const rawData = await this.#articleService.getAllArticles();
    this.articles = this.transformData(rawData).filter(article => article.active) || [];
  }

  transformData(rawData) {
    const ids = rawData[0];
    const names = rawData[1];
    const ownerAddresses = rawData[2];
    const prices = rawData[3];
    const activeStatuses = rawData[4];

    return ids.map((id, index) => ({
      id: Number(id),
      name: names[index],
      ownerAddress: ownerAddresses[index],
      price: parseFloat(Web3.utils.fromWei(prices[index], 'ether')),
      active: activeStatuses[index]
    }));
  }

  async createBooking() {
    if (this.bookingForm.invalid) return;
    const { customerAddress, articles } = this.bookingForm.value;
    try {
      await this.#bookingService.createBooking(customerAddress, articles);
      console.log('Booking created successfully');
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
