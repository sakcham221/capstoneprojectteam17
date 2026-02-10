import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-deposit-dialog',
  templateUrl: './deposit-dialog.component.html',
  standalone: false,
  styleUrls: ['./deposit-dialog.component.css']
})
export class DepositDialogComponent {
  depositForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DepositDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { accountId: number }
  ) {
    this.depositForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      remark: ['']
    });
  }

  onSubmit(): void {
    if (this.depositForm.invalid) return;

    const { amount, remark } = this.depositForm.value;

    this.accountService.deposit(this.data.accountId, amount, remark).subscribe({
      next: () => {
        this.snackBar.open('Deposit successful!', '', { duration: 2000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Deposit failed!', '', { duration: 2000 });
      }
    });
  }
}
