import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service'; 
import { AuthService } from '../../../services/auth.service'; 

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  standalone: false,
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  balance: number | string | null = 'Loading balance...';
  accountId!: number;

  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const accountId = this.authService.getUserInfo()?.account_id;
    if (!accountId) {
      this.balance = 'No account ID';
      return;
    }
  
    this.accountService.getBalance(accountId).subscribe({
      next: (res) => {
        this.balance = res;
      },
      error: (err) => {
        console.error('Balance fetch failed:', err);
        this.balance = 'Error fetching balance';
      }
    });  
  }
}
