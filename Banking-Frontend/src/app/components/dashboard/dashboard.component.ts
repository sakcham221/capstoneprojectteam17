import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '../../services/account.service';

import { DepositDialogComponent } from './deposit-dialog/deposit-dialog.component';
import { WithdrawDialogComponent } from './withdraw-dialog/withdraw-dialog.component';
import { TransferDialogComponent } from './transfer-dialog/transfer-dialog.component';
import { BalanceComponent } from './balance/balance.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { CreateAccountDialogComponent } from '../manager-dashboard/create-account-dialog/create-account-dialog.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone : false,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  accountId: number | null = null;

  loadAccounts() {

  const userId = this.authService.getUserId();

  if (!userId) return;

  this.accountService.getAccountsByUser(userId).subscribe({

    next: (accounts) => {

      console.log('Accounts:', accounts);

      if (accounts.length > 0) {

        this.accountId = accounts[0].id;

        const user = this.authService.getUserInfo();
        user.account_id = this.accountId;

        localStorage.setItem('authUser', JSON.stringify(user));

      } else {

        this.accountId = null; // no account yet
      }

    },

    error: (err) => {
      console.error('Error fetching accounts:', err);
    }

  });
}


  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    this.userName = user?.email || 'User';
  
    const userId = this.authService.getUserId();
    console.log('User ID:', userId);
  
    if (userId) {
      this.accountService.getAccountsByUser(userId).subscribe({
        next: (accounts) => {
          console.log('Accounts:', accounts);
          if (accounts.length > 0) {
            this.accountId = accounts[0].id;

            const user = this.authService.getUserInfo();
            user.account_id = this.accountId;
            localStorage.setItem('authUser', JSON.stringify(user));
          } else {
            alert('No accounts found for this user.');
          }
        },
        error: (err) => {
          console.error('Error fetching accounts:', err);
          alert('Error fetching account.');
        }
      });
    }
  }
  
  goToFeature(feature: string): void {
    if (!this.accountId && ['deposit', 'withdraw'].includes(feature)) {
      alert('No account ID found.');
      return;
    }

    switch (feature) {
      case 'deposit':
        this.dialog.open(DepositDialogComponent, {
          width: '400px',
          data: { accountId: this.accountId }
        });
        break;

      case 'withdraw':
        this.dialog.open(WithdrawDialogComponent, {
          width: '400px',
          data: { accountId: this.accountId }
        });
        break;

      case 'transfer':
        this.dialog.open(TransferDialogComponent, {
          width: '450px'
        });
        break;

      case 'balance':
        this.dialog.open(BalanceComponent, {
          width: '400px'
        });
        break;

      case 'transactions':
        this.dialog.open(TransactionsComponent, {
          width: '800px'
        });
        break;

      case 'profile':
        this.dialog.open(UpdateProfileComponent, {
          width: '450px'
        });
        break;

      default:
        alert('Feature not implemented.');
    }
  }
  openCreateAccount() {

  const userId = this.authService.getUserId();

  if (!userId) {
    alert('User not logged in');
    return;
  }

  const dialogRef = this.dialog.open(
    CreateAccountDialogComponent,
    {
      width: '450px',
      data: { userId: userId }
    }
  );

  dialogRef.afterClosed().subscribe(result => {

    if (result) {
      // Reload accounts after creation
      this.loadAccounts();
    }

  });
}

}
