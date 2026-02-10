import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://bankproject-djg3ftb6gkfjcda8.canadacentral-01.azurewebsites.net/api';

  constructor(private http: HttpClient) {}

  // 🔹 Admin: Get all users
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/users`);
  }

  // 🔹 Manager: Get assigned users
  getAssignedUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/manager/assigned-users`);
  }

  // 🔹 Admin: Create a new user
  createUserAsAdmin(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/create-user`, user, { responseType: 'text' });
  }

  // 🔹 Manager: Create a user
  createUserAsManager(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/manager/create-user`, user, { responseType: 'text' });
  }

  // 🔹 Assign user to manager (Admin)
  assignUserToManager(userId: number, managerId: number): Observable<any> {
    const payload = { userId, managerId };
    return this.http.put(`${this.baseUrl}/admin/assign-manager`, payload, { responseType: 'text' });
  }
  

  // 🔹 Update user profile (full_name, password)
  updateUser(userId: number, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/update/${userId}`, payload);
  }

  // 🔹 Delete user (admin only)
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/users/${userId}`);
  }

  createManager(manager: any): Observable<any> {
    return this.http.post(`https://bankproject-djg3ftb6gkfjcda8.canadacentral-01.azurewebsites.net/api/admin/create-manager`, manager, { responseType: 'text' });
  }
}
