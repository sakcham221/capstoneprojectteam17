import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assign-manager-dialog',
  templateUrl: './assign-manager-dialog.component.html',
  standalone: false,
  styleUrls: ['./assign-manager-dialog.component.css']
})
export class AssignManagerDialogComponent implements OnInit {
  form!: FormGroup;
  managers: any[] = [];
  users: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<AssignManagerDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userId: ['', Validators.required],
      managerId: ['', Validators.required]
    });

    this.userService.getAllUsers().subscribe((res) => {
      this.users = res.filter((u: any) => u.role === 'USER');
      this.managers = res.filter((u: any) => u.role === 'MANAGER');
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { userId, managerId } = this.form.value;

    this.userService.assignUserToManager(userId, managerId).subscribe({
      next: () => {
        this.snackBar.open('User assigned successfully!', '', { duration: 2000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Assignment failed.', '', { duration: 2000 });
      }
    });
  }
}
