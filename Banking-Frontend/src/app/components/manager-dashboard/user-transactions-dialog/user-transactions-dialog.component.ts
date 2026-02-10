import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-user-transactions-dialog',
  templateUrl: './user-transactions-dialog.component.html',
  standalone: false,
  styleUrls: ['./user-transactions-dialog.component.css']
})
export class UserTransactionsDialogComponent implements OnInit {
  transactions: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.transactionService.getTransactionsByAccount(this.data.userId).subscribe({
      next: (res) => this.transactions = res,
      error: () => this.transactions = []
    });
  }
}
