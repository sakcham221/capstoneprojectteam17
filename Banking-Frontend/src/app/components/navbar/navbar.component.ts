import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: false,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToDashboard(): void {
    const role = this.authService.getRole();
    if (role === 'ADMIN') this.router.navigate(['/admin-dashboard']);
    else if (role === 'MANAGER') this.router.navigate(['/manager-dashboard']);
    else this.router.navigate(['/dashboard']);
  }
}
