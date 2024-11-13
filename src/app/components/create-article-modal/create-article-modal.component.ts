import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { bookingContractABI, bookingContractAddress } from '../../utils/constants';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {ArticleService} from '../../services/article.service';

@Component({
  selector: 'app-create-article-modal',
  templateUrl: './create-article-modal.component.html',
  styleUrls: ['./create-article-modal.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatDialogActions,
    MatButton,
    MatError,
    MatLabel
  ],
  standalone: true
})
export class CreateArticleModalComponent {
  articleForm: FormGroup;
  #web3: Web3;
  #contract: Contract<any>;
  #articleService: ArticleService = inject(ArticleService);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateArticleModalComponent>
  ) {
    this.articleForm = this.fb.group({
      name: ['', Validators.required],
      business: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });

    this.#web3 = new Web3(Web3.givenProvider || 'https://columbus.camino.network/ext/bc/C/rpc');
    this.#contract = new this.#web3.eth.Contract(bookingContractABI, bookingContractAddress);
  }

  async createArticle() {
    if (this.articleForm.invalid) return;
    const { name, business, price } = this.articleForm.value;
    try {
      await this.#articleService.createArticle(name, business, price);
      console.log('Article created successfully');
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Error creating article:', error);
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
