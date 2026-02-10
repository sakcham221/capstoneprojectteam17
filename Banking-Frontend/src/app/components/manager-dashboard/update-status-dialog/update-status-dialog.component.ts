import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '../../../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-status-dialog',
  templateUrl: './update-status-dialog.component.html',
  standalone: false,
  styleUrls: ['./update-status-dialog.component.css']
})
export class UpdateStatusDialogComponent {
  statuses: string[] = ['ACTIVE','CLOSED','PENDING','SUSPENDED'];
  selectedStatus: string = '';

  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { accountId: number }
  ) {}

  onUpdate(): void {
    if (!this.selectedStatus) return;

    this.accountService.updateAccountStatus(this.data.accountId, this.selectedStatus).subscribe({
      next: () => {
        this.snackBar.open('Account status updated!', '', { duration: 2000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Failed to update status.', '', { duration: 2000 });
      }
    });
  }
}
