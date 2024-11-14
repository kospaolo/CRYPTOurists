import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deploy-contract-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
  template: `
    <h2 mat-dialog-title>Deploy Smart Contract</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" class="w-100">
        <mat-label>Operator Fee (%)</mat-label>
        <input matInput type="number" [(ngModel)]="operatorFee" min="0" max="100">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="deploy()">Deploy</button>
    </mat-dialog-actions>
  `
})
export class DeployContractModalComponent {
  dialogRef = inject(MatDialogRef<DeployContractModalComponent>);
  operatorFee: number = 5;

  deploy() {
    this.dialogRef.close(this.operatorFee);
  }
} 