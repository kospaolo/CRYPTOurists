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
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatIcon} from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import {Article} from '../../models/article.model';
import {CurrencyPipe} from '@angular/common';
import {MatPaginator} from '@angular/material/paginator';
import {ARTICLES} from '../../data/articles.data';
import {ArticleDetailsModalComponent} from '../../components/article-details-modal/article-details-modal.component';


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
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  #dialog: MatDialog = inject(MatDialog);
  #snackBar: MatSnackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'type', 'address', 'price'];
  dataSource = new MatTableDataSource<Article>([...ARTICLES]);
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

  ngOnInit() {
    this.dataSource.data = [...ARTICLES];
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  createActivity() {
    console.log('Open create activity modal');
  }

  openActivity(activity: Activity) {
    console.log('Open activity details modal for', activity);
  }

  deleteActivity(activityId: number) {
    this.dataSource.data = this.dataSource.data.filter(activity => activity.id !== activityId);

    this.#snackBar.open('Activity deleted', 'Close', {
      duration: 2000,
    });
  }

  removeArticle(articleId: number) {
    this.dataSource.data = this.dataSource.data.filter(article => article.id !== articleId);
  }

  openArticleModal(article: Article) {
    this.#dialog.open(ArticleDetailsModalComponent, {
      data: article,
      width: '800px'
    });
  }
}
