import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  role: string = 'user';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.role = this.route.snapshot.paramMap.get('role') || 'user';
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('===== LOGIN SUCCESS =====');
        console.log('Full Response:', res);
        console.log('Response Keys:', Object.keys(res));
        console.log('Token in storage?', localStorage.getItem('authToken'));
        console.log('User in storage?', localStorage.getItem('authUser'));
        console.log('=======================');
        
        const userRole = this.authService.getRole();
        this.snackBar.open('Login successful!', '', { duration: 2000 });

        // Redirect based on role
        if (userRole === 'ADMIN') this.router.navigate(['/admin-dashboard']);
        else if (userRole === 'MANAGER') this.router.navigate(['/manager-dashboard']);
        else this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('===== LOGIN FAILED =====');
        console.error('Error:', err);
        console.log('=======================');
        this.snackBar.open('Invalid credentials!', '', { duration: 2000 });
      }
    });
  }
}
