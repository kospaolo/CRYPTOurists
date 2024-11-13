import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Article} from '../../models/article.model';
import {CurrencyPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';

class ArticleModalComponent {
}

@Component({
  selector: 'app-article-details-modal',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    CurrencyPipe,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './article-details-modal.component.html',
  styleUrl: './article-details-modal.component.scss'
})
export class ArticleDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ArticleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Article
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  generatePDF() {
    // Placeholder for PDF generation functionality
    console.log("Generating PDF for", this.data);
  }
}
