import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject, Optional } from '@angular/core';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      role: ['USER', Validators.required]
        });

    // Pre-fill role from dialog data if provided
    if (this.data?.role) {
      this.registerForm.patchValue({ role: this.data.role });
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const newUser = {
      fullName: this.registerForm.value.fullName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role
    };

    this.authService.register(newUser).subscribe({
      next: () => {
        this.snackBar.open('Registration successful!', '', { duration: 2000 });
        this.router.navigate(['/login/user']);
      },
      error: (err) => {
  console.log("FULL ERROR:", err);

  let message = 'Registration failed';

  if (err.error) {
    if (typeof err.error === 'string') {
      message = err.error; // plain text from backend
    } 
    else if (err.error.message) {
      message = err.error.message; // JSON message
    }
  }

  this.snackBar.open(message, '', { duration: 4000 });
}


    });
  }
}
