import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  standalone :false,
  styleUrls: ['./create-user-dialog.component.css']
})
export class AdminCreateUserDialogComponent {
  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AdminCreateUserDialogComponent>
  ) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const payload = {
      ...this.userForm.value,
      role: 'USER'
    };

    this.userService.createUserAsAdmin(payload).subscribe({
      next: () => {
        this.snackBar.open('User created successfully!', '', { duration: 2000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Creation error:', err);
        this.snackBar.open('Failed to create user.', '', { duration: 2000 });
      }
    });
  }
}
