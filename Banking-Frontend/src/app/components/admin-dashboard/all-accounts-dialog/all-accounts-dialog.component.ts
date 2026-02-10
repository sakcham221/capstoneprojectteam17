import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '../../../services/account.service';
import { UpdateStatusDialogComponent } from '../../manager-dashboard/update-status-dialog/update-status-dialog.component';

@Component({
  selector: 'app-all-accounts-dialog',
  templateUrl: './all-accounts-dialog.component.html',
  standalone : false,
  styleUrls: ['./all-accounts-dialog.component.css']
})
export class AllAccountsDialogComponent implements OnInit {
  accounts: any[] = [];
  displayedColumns: string[] = [
    'id', 'accountNumber', 'accountType', 'balance', 'createdAt', 'userId', 'status', 'remark', 'managerId', 'actions'
  ];

  constructor(private accountService: AccountService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (res) => {
        this.accounts = res;
      },
      error: (err) => {
        console.error('❌ Failed to load accounts:', err);
      }
    });
  }

  openUpdateStatusDialog(accountId: number): void {
    const dialogRef = this.dialog.open(UpdateStatusDialogComponent, {
      width: '400px',
      data: { accountId }
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        // Refresh account list after status update
        this.ngOnInit();
      }
    });
  }
}
