import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialogActions, MatDialogContent,
  MatDialogRef, MatDialogTitle
} from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-article-details-modal',
  standalone: true,
  imports: [
    MatButton,
    CurrencyPipe,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions
  ],
  templateUrl: './article-details-modal.component.html',
  styleUrls: ['./article-details-modal.component.scss']
})

export class ArticleDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ArticleDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
