import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  private baseUrl = 'https://bankproject-djg3ftb6gkfjcda8.canadacentral-01.azurewebsites.net/api/accounts';

  constructor(private http: HttpClient) {}

  // 🔹 Create account (admin/manager)
  createAccount(userId: number, account: any, managerId?: number): Observable<any> {
    const params = managerId ? `?managerId=${managerId}` : '';
    return this.http.post(`${this.baseUrl}/create/${userId}${params}`, account);
  }

  // 🔹 Update account info
  updateAccount(accountId: number, updatedAccount: any, managerId?: number): Observable<any> {
    const params = managerId ? `?managerId=${managerId}` : '';
    return this.http.put(`${this.baseUrl}/update/${accountId}${params}`, updatedAccount);
  }

  // 🔹 Update account status (enum: ACTIVE, CLOSED, PENDING, SUSPENDED)
  updateAccountStatus(accountId: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/status/${accountId}?status=${status}`, {});
  }

  // 🔹 Get all accounts (admin)
  getAllAccounts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  // 🔹 Get user’s accounts (manager/user)
  getAccountsByUser(userId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = {
      Authorization: `Bearer ${token}`
    };
  
    return this.http.get(`${this.baseUrl}/user/${userId}`, { headers });
  }
  

  // 🔹 Get balance of an account
  getBalance(accountId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${accountId}/balance`);
  }

  deposit(accountId: number, amount: number, remark?: string) {
    const payload = {
      transactionType: 'DEPOSIT',
      amount,
      accountId,
      remark
    };
    return this.http.post('https://bankproject-djg3ftb6gkfjcda8.canadacentral-01.azurewebsites.net/api/transactions', payload);
  }  

  withdraw(accountId: number, amount: number, remark?: string) {
    const payload = {
      transactionType: 'WITHDRAWAL',
      amount,
      accountId,
      remark
    };
    return this.http.post('https://bankproject-djg3ftb6gkfjcda8.canadacentral-01.azurewebsites.net/api/transactions', payload);
  }
  
}
