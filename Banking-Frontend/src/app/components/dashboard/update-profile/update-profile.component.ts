import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  standalone: false,
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    this.userId = user?.id;
    
    console.log('UpdateProfile: User info:', user);
    console.log('UpdateProfile: Token from storage:', this.authService.getToken());

    this.profileForm = this.fb.group({
      full_name: [user?.full_name, Validators.required],
      password: [''] // optional field
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    const payload: any = {
      full_name: this.profileForm.value.full_name
    };

    if (this.profileForm.value.password) {
      payload.password = this.profileForm.value.password;
    }

    console.log('UpdateProfile: Sending payload:', payload);
    console.log('UpdateProfile: User ID:', this.userId);
    console.log('UpdateProfile: Token:', this.authService.getToken()?.substring(0, 50) + '...');

    this.userService.updateUser(this.userId, payload).subscribe({
      next: () => {
        console.log('UpdateProfile: Success!');
        this.snackBar.open('Profile updated!', '', { duration: 2000 });
      },
      error: (error) => {
        console.error('========== UPDATE PROFILE ERROR ==========');
        console.error('Status:', error.status);
        console.error('StatusText:', error.statusText);
        console.error('Error Body:', error.error);
        console.error('Full Error:', JSON.stringify(error, null, 2));
        console.error('==========================================');
        
        if (error.status === 401) {
          this.snackBar.open('Unauthorized! Please login again.', '', { duration: 3000 });
        } else {
          this.snackBar.open('Update failed! Check console for details.', '', { duration: 3000 });
        }
      }
    });
  }
}
