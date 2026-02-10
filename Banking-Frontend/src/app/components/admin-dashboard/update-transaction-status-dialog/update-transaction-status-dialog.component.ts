import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-update-transaction-status-dialog',
  templateUrl: './update-transaction-status-dialog.component.html',
  standalone: false,
  styleUrls: ['./update-transaction-status-dialog.component.css']
})
export class UpdateTransactionStatusDialogComponent {
  transactionId: number;
  selectedStatus: string = '';
  statuses: string[] = ['SUCCESS', 'PENDING', 'FAILED'];

  constructor(
    public dialogRef: MatDialogRef<UpdateTransactionStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transactionService: TransactionService
  ) {
    this.transactionId = data.transactionId;
  }

  onUpdate(): void {
    if (!this.transactionId || !this.selectedStatus) {
      alert('Please select a valid status.');
      return;
    }
    
    this.transactionService.updateTransactionStatus(this.transactionId, this.selectedStatus)
    .subscribe({
      next: (res) => {
        console.log('✅ Successfully updated transaction:', res);
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('❌ Error updating transaction status:', err);
        alert('Failed to update transaction status: ' + (err.error?.message || err.statusText || 'Unknown error'));
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
