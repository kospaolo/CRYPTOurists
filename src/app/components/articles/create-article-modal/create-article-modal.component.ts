import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { contractABI, contractAddress } from '../../../utils/constants';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { ArticleService } from '../../../services/article.service';
import { businessAddresses } from '../../../utils/constants';

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
export class CreateArticleModalComponent implements OnInit {
  articleForm: FormGroup;
  isBusiness: boolean = false;
  walletAddress: string | null = sessionStorage.getItem('wallet-address');
  #web3: Web3;
  #contract: Contract<any>;
  #articleService: ArticleService = inject(ArticleService);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateArticleModalComponent>
  ) {
    this.articleForm = this.fb.group({
      name: ['', Validators.required],
      business: [{ value: '', disabled: true }, Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });

    this.#web3 = new Web3(Web3.givenProvider || 'https://columbus.camino.network/ext/bc/C/rpc');
    this.#contract = new this.#web3.eth.Contract(contractABI, contractAddress);
  }

  ngOnInit() {
    const isBusiness = businessAddresses
      .map(address => address.toLowerCase())
      .includes(this.walletAddress?.toLowerCase() ?? "");
    if (this.walletAddress && isBusiness) {
      this.isBusiness = true;
      this.articleForm.patchValue({ business: this.walletAddress });
      this.articleForm.get('business')?.disable();
    } else {
      this.articleForm.get('business')?.enable();
    }
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
