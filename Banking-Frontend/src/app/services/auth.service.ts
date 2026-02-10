import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://bankproject-djg3ftb6gkfjcda8.canadacentral-01.azurewebsites.net/api';
  private tokenKey = 'authToken';
  private userKey = 'authUser';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password }).pipe(
      tap((res: any) => {
        console.log('LOGIN RESPONSE:', res);
        console.log('LOGIN RESPONSE Keys:', Object.keys(res));

        // Check multiple possible token field names
        const token = res.token || res.accessToken || res.jwtToken || res.data?.token;
        
        if (token) {
          localStorage.setItem(this.tokenKey, token);
          console.log('✓ Token stored successfully:', token.substring(0, 20) + '...');
        } else {
          console.error('✗ No token found in login response!', res);
        }

        const userInfo = {
          email: res.email,
          role: res.role,
          id: res.userId
        };
        localStorage.setItem(this.userKey, JSON.stringify(userInfo));
        console.log('✓ User info stored:', userInfo);
      })
    );
  }

  extractRoleFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (e) {
      return null;
    }
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, user);
  }


  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      console.log('✓ Token retrieved from storage:', token.substring(0, 20) + '...');
    } else {
      console.warn('✗ No token in localStorage');
    }
    return token;
  }

  getUserInfo(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getRole(): string | null {
    return this.getUserInfo()?.role || null;
  }

  getUserId(): number {
  const user = localStorage.getItem('authUser');
  return user ? JSON.parse(user).id : 0;
}

isAdmin(): boolean {
  // Check if the current user has admin role
  const user = this.getUserInfo(); // or however you store the current user
  return user?.role === 'ADMIN';
}

isManager(): boolean {
  // Check if the current user has manager role
  const user = this.getUserInfo(); // or however you store the current user
  return user?.role === 'MANAGER';

}
}
