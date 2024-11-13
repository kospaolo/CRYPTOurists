import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import {CurrencyPipe, NgIf, SlicePipe} from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { ArticleDetailsModalComponent } from '../../components/articles/article-details-modal/article-details-modal.component';
import { ArticleService } from '../../services/article.service';
import { ToastrService } from 'ngx-toastr';
import { CreateArticleModalComponent } from '../../components/articles/create-article-modal/create-article-modal.component';
import {adminAddresses, businessAddresses} from '../../utils/constants';
import {Web3} from 'web3';
import {PinataService} from '../../services/pdf.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-articles',
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
    SlicePipe,
    NgIf,
    MatProgressSpinner
  ],
  providers: [PinataService],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  #dialog: MatDialog              = inject(MatDialog);
  #toastr: ToastrService          = inject(ToastrService);
  #articleService: ArticleService = inject(ArticleService);
  #pinataService: PinataService         = inject(PinataService);

  displayedColumns: string[] = ['name', 'address', 'price', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  walletAddress: string | null = sessionStorage.getItem('wallet-address');

  isAdmin: boolean    = false;
  isBusiness: boolean = false;
  selectedFile: File | null = null;

  pdfData = {
    title: 'TITL',
    description: 'DESC',
    date: new Date().toISOString().split('T')[0]
  };
  status: string  = '';
  ipfsUrl: string = '';
  isUploading: boolean = false;
  loading: boolean     = true;

  constructor() {
    if(this.walletAddress) {
      this.isAdmin = adminAddresses
        .map(address => address.toLowerCase())
        .includes(this.walletAddress.toLowerCase());

      this.isBusiness = businessAddresses
        .map(address => address.toLowerCase())
        .includes(this.walletAddress.toLowerCase());
    }
  }

  async ngOnInit() {
    await this.fetchArticles();
  }

  async fetchArticles() {
    this.loading = true;
    const rawData = await this.#articleService.getAllArticles();
    const articles = this.transformData(rawData) || [];

    if (this.isBusiness && this.walletAddress) {
      this.dataSource.data = articles.filter(article => article.ownerAddress.toLowerCase() === this.walletAddress.toLowerCase());
    } else {
      this.dataSource.data = articles.filter(article => article.active);
    }
    this.loading = false;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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

  async removeArticle(article: any) {
    await this.#articleService.deleteArticle(article)
    this.#toastr.success('Article deleted successfully.', 'Success');
  }

  openArticleDetailsModal(article: any) {
    this.#dialog.open(ArticleDetailsModalComponent, {
      data: article,
      width: '800px'
    });
  }

  openCreateArticleModal() {
    const dialogRef = this.#dialog.open(CreateArticleModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.fetchArticles();
      }
    });
  }

  generateAndPreview() {
    const pdfFile = this.#pinataService.generatePDF(this.pdfData);
    const url = URL.createObjectURL(pdfFile);
    window.open(url, '_blank');
  }

  generateAndUpload() {
    this.isUploading = true;
    this.status = 'Generating PDF and uploading to IPFS...';

    this.#pinataService.generateAndUpload(this.pdfData).subscribe({
      next: (response) => {
        this.isUploading = false;
        if (response.success) {
          this.status = 'Upload successful!';
          this.ipfsUrl = response.gatewayURL;
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

}
