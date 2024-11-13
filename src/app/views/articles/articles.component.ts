import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import {Article} from '../../models/article.model';
import {CurrencyPipe} from '@angular/common';
import {MatPaginator} from '@angular/material/paginator';
import {ArticleDetailsModalComponent} from '../../components/article-details-modal/article-details-modal.component';
import {ArticleService} from '../../services/article.service';
import {ToastrService} from 'ngx-toastr';
import {CreateArticleModalComponent} from '../../components/create-article-modal/create-article-modal.component';

interface Activity {
  id: number;
  name: string;
}

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
    MatPaginator
  ],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  #dialog: MatDialog              = inject(MatDialog);
  #toastr: ToastrService          = inject(ToastrService);
  #articleService: ArticleService = inject(ArticleService);

  displayedColumns: string[] = ['name', 'address', 'price', 'actions'];
  dataSource = new MatTableDataSource<Article>([]);
  isAdmin: boolean = false;

  constructor() {
    const adminAddresses = ['0xc09CD05e58aB5Bd8862DEe3f44e6ddAd5567F091']
    const walletAddress = sessionStorage.getItem('wallet-address');
    if(walletAddress) {
      this.isAdmin = adminAddresses
        .map(address => address.toLowerCase())
        .includes(walletAddress.toLowerCase());
    }
  }

  async ngOnInit() {
    await this.fetchArticles();
  }

  async fetchArticles() {
    // Get all articles and transform the raw data
    const rawData = await this.#articleService.getAllArticles();
    const articles = this.transformData(rawData) || [];
    // Filter only active articles and set them to dataSource
    this.dataSource.data = articles.filter(article => article.active);
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
      price: Number(prices[index]),
      active: activeStatuses[index]
    }));
  }

  removeArticle(articleId: number) {
    this.dataSource.data = this.dataSource.data.filter(article => article.id !== articleId);
    this.#toastr.success('Article deleted successfully.', 'Success');
  }

  openArticleModal(article: Article) {
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
}
