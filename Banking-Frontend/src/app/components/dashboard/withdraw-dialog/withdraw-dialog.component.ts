import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-withdraw-dialog',
  templateUrl: './withdraw-dialog.component.html',
  standalone: false,
  styleUrls: ['./withdraw-dialog.component.css']
})
export class WithdrawDialogComponent {
  withdrawForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<WithdrawDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { accountId: number }
  ) {
    this.withdrawForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      remark: ['']
    });
  }

  onSubmit(): void {
    if (this.withdrawForm.invalid) return;
    const { amount, remark } = this.withdrawForm.value;
    this.accountService.withdraw(this.data.accountId, amount, remark).subscribe({
      next: () => {
        this.snackBar.open('Withdrawal successful!', '', { duration: 2000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Withdrawal failed!', '', { duration: 2000 });
      }
    });
  }
}
