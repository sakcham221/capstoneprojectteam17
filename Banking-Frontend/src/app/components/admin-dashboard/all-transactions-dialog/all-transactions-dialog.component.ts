import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTransactionStatusDialogComponent } from '../update-transaction-status-dialog/update-transaction-status-dialog.component';

@Component({
  selector: 'app-all-transactions-dialog',
  templateUrl: './all-transactions-dialog.component.html',
  standalone: false,
  styleUrls: ['./all-transactions-dialog.component.css']
})
export class AllTransactionsDialogComponent implements OnInit {
  transactions: any[] = [];

  constructor(
    private transactionService: TransactionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.refreshTransactions();
  }
  
  refreshTransactions(): void {
    this.transactionService.getAllTransactions().subscribe({
      next: (res) => {
        console.log('Transactions refreshed:', res); // verify clearly
        this.transactions = res;
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
        this.transactions = [];
      }
    });
  }
  
  updateTransactionStatus(txId: number): void {
    const dialogRef = this.dialog.open(UpdateTransactionStatusDialogComponent, {
      width: '400px',
      data: { transactionId: txId }
    });
  
    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.refreshTransactions();
      }
    });
  }  
}