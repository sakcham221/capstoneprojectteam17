import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-admin-dialog',
  templateUrl: './create-admin-dialog.component.html',
  standalone: false,
  styleUrls: ['./create-admin-dialog.component.css']
})
export class CreateAdminDialogComponent {
  adminForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateAdminDialogComponent>
  ) {
    this.adminForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit(): void {
    if (this.adminForm.invalid) return;

    const payload = {
      ...this.adminForm.value,
      role: 'ADMIN'
    };

    this.userService.createUserAsAdmin(payload).subscribe({
      next: () => {
        this.snackBar.open('Admin created successfully!', '', { duration: 2000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Failed to create admin.', '', { duration: 2000 });
      }
    });
  }
}
