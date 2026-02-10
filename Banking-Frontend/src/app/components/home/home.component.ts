import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router,
              public authService: AuthService
  ) {}

  goToLogin(role: string) {
    this.router.navigate(['/login', role]);
  }
}
