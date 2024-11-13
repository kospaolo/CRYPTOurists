import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
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


interface Activity {
  id: number;
  name: string;
}

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
    MatSortModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Activity>([
    { id: 1, name: 'Hiking' },
    { id: 2, name: 'Kayaking' },
    { id: 3, name: 'Biking' }
  ]);
  #dialog: MatDialog = inject(MatDialog);
  #snackBar: MatSnackBar = inject(MatSnackBar);
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  createActivity() {
    console.log('Open create activity modal');
  }

  openActivity(activity: Activity) {
    console.log('Open activity details modal for', activity);
  }

  deleteActivity(activityId: number) {
    this.dataSource.data = this.dataSource.data.filter(activity => activity.id !== activityId);

    // Show a delete confirmation
    this.#snackBar.open('Activity deleted', 'Close', {
      duration: 2000,
    });
  }
}
