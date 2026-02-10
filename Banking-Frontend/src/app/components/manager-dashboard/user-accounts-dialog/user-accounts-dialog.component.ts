import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-user-accounts-dialog',
  templateUrl: './user-accounts-dialog.component.html',
  standalone: false,
  styleUrls: ['./user-accounts-dialog.component.css']
})
export class UserAccountsDialogComponent implements OnInit {
  accounts: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.accountService.getAccountsByUser(this.data.userId).subscribe({
      next: (res) => this.accounts = res,
      error: () => this.accounts = []
    });
  }
}
