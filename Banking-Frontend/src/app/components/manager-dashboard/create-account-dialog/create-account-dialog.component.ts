import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '../../../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-account-dialog',
  templateUrl: './create-account-dialog.component.html',
  standalone : false,
  styleUrls: ['./create-account-dialog.component.css']
})
export class CreateAccountDialogComponent {
  accountForm: FormGroup;
  managerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number }
  ) {
    this.accountForm = this.fb.group({
      accountType: ['SAVINGS', Validators.required],
      balance: [0, [Validators.required, Validators.min(0)]],
      remark: ['']
    });

    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.managerId = payload.role === 'MANAGER' ? payload.userId || null : null;
    }
  }

  onSubmit(): void {
    if (this.accountForm.invalid) return;

    const formValue = this.accountForm.value;

    this.accountService
      .createAccount(this.data.userId, formValue, this.managerId || undefined)
      .subscribe({
        next: () => {
          this.snackBar.open('✅ Account created successfully!', '', { duration: 2000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('❌ Error creating account:', err);
          this.snackBar.open('❌ Failed to create account.', '', { duration: 2000 });
        }
      });
  }
}
