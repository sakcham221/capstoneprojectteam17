import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  standalone: false,
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  displayedColumns: string[] = ['type', 'amount', 'status', 'timestamp', 'from', 'to'];

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const accountId = this.authService.getUserInfo()?.account_id;
    if (accountId) {
      this.transactionService.getTransactionsByAccount(accountId).subscribe({
        next: (res) => this.transactions = res,
        error: () => this.transactions = []
      });
    }
  }
}
