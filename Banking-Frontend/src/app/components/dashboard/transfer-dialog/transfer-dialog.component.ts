import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../../services/transaction.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  standalone: false,
  styleUrls: ['./transfer-dialog.component.css']
})
export class TransferDialogComponent {
  transferForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TransferDialogComponent>
  ) {
    this.transferForm = this.fb.group({
      toAccountNumber: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      remark: ['']
    });
  }

  onSubmit(): void {
    if (this.transferForm.invalid) return;

    const payload = {
      toAccountNumber: this.transferForm.value.toAccountNumber,
      amount: this.transferForm.value.amount,
      remark: this.transferForm.value.remark,
      transactionType: 'TRANSFER'
    };

    this.transactionService.makeTransaction(payload).subscribe({
      next: () => {
        this.snackBar.open('Transfer successful!', '', { duration: 2000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Transfer failed!', '', { duration: 2000 });
      }
    });
  }
}
