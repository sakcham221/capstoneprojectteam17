import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateAdminDialogComponent } from './create-admin-dialog/create-admin-dialog.component';
import { CreateManagerDialogComponent } from './create-manager-dialog/create-manager-dialog.component';
import { AdminCreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { AssignManagerDialogComponent } from './assign-manager-dialog/assign-manager-dialog.component';
import { AllTransactionsDialogComponent } from './all-transactions-dialog/all-transactions-dialog.component';
import { AllAccountsDialogComponent } from './all-accounts-dialog/all-accounts-dialog.component'; // ✅ NEW
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  standalone: false,
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  constructor(private dialog: MatDialog) {}

  openCreateAdminDialog(): void {
  this.dialog.open(RegisterComponent, {
    width: '450px',
    data: { role: 'ADMIN' }
  });
}

  openCreateManagerDialog(): void {
  this.dialog.open(RegisterComponent, {
    width: '450px',
    data: { role: 'MANAGER' }
  });
}

  openCreateUserDialog(): void {
  this.dialog.open(RegisterComponent, {
    width: '450px',
    data: { role: 'USER' }
  });
}

  openAssignManagerDialog(): void {
    this.dialog.open(AssignManagerDialogComponent, { width: '500px' });
  }

  openAllTransactionsDialog(): void {
    this.dialog.open(AllTransactionsDialogComponent, { width: '1000px' });
  }

  openUpdateAccountListDialog(): void {
    this.dialog.open(AllAccountsDialogComponent, { width: '1000px' });
  }
}
