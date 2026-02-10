import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ManagerCreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { UserAccountsDialogComponent } from './user-accounts-dialog/user-accounts-dialog.component';
import { UserTransactionsDialogComponent } from './user-transactions-dialog/user-transactions-dialog.component';
import { CreateAccountDialogComponent } from './create-account-dialog/create-account-dialog.component';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  standalone : false,
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent {
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  openCreateUserDialog(): void {
    this.dialog.open(ManagerCreateUserDialogComponent, { width: '450px' });
  }

  promptUserIdAndOpenAccounts(): void {
    const userId = prompt('Enter User ID to view accounts:');
    if (userId && !isNaN(+userId)) {
      this.dialog.open( UserAccountsDialogComponent, {
        width: '800px',
        data: { userId: +userId }
      });
    } else {
      this.snackBar.open('Invalid User ID.', '', { duration: 2000 });
    }
  }

  promptUserIdAndOpenTransactions(): void {
    const userId = prompt('Enter Account ID to view transactions:');
    if (userId && !isNaN(+userId)) {
      this.dialog.open(UserTransactionsDialogComponent, {
        width: '900px',
        data: { userId: +userId }
      });
    } else {
      this.snackBar.open('Invalid User ID.', '', { duration: 2000 });
    }
  }

  promptUserIdAndCreateAccount(): void {
    const userId = prompt('Enter User ID to create an account:');
    if (userId && !isNaN(+userId)) {
      this.dialog.open(CreateAccountDialogComponent, {
        width: '500px',
        data: { userId: +userId }
      });
    } else {
      this.snackBar.open('Invalid User ID.', '', { duration: 2000 });
    }
  }
}
