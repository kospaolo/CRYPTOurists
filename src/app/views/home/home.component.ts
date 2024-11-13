import {Component, inject, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatIcon} from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import {CurrencyPipe, DatePipe, NgClass, SlicePipe} from '@angular/common';
import {MatPaginator} from '@angular/material/paginator';
import {BookingService} from '../../services/booking.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButton,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatIconButton,
    MatIcon,
    MatSortModule,
    CurrencyPipe,
    MatPaginator,
    NgClass,
    DatePipe,
    SlicePipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  bookings: any[] = [];
  displayedColumns: string[] = ['bookingId', 'totalAmount', 'operatorFee', 'timestamp', 'customer', 'status', 'articleCount'];
  #bookingService: BookingService = inject(BookingService);

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.#bookingService.getAllBookings().then(bookings => {
      this.bookings = bookings;
    });
  }
}
