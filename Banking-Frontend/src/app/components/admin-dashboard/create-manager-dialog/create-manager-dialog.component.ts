import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-manager-dialog',
  templateUrl: './create-manager-dialog.component.html',
  standalone: false,
  styleUrls: ['./create-manager-dialog.component.css']
})
export class CreateManagerDialogComponent {
  managerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateManagerDialogComponent>
  ) {
    this.managerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit(): void {
    if (this.managerForm.invalid) return;

    const payload = {
      ...this.managerForm.value,
      role: 'MANAGER'
    };

    this.userService.createManager(payload).subscribe({
      next: () => {
        this.snackBar.open('Manager created successfully!', '', { duration: 2000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Failed to create manager.', '', { duration: 2000 });
      }
    });
  }
}
