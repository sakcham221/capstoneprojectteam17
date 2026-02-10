import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'https://bankproject-djg3ftb6gkfjcda8.canadacentral-01.azurewebsites.net/api/transactions';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // wherever you store your JWT
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // 🔹 Make a transaction (deposit, withdraw, transfer)
  makeTransaction(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, payload, { headers: this.getAuthHeaders() });
  }

  // 🔹 Get transactions by account ID
  getTransactionsByAccount(accountId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${accountId}`, { headers: this.getAuthHeaders() });
  }

  // 🔹 Admin: Get all transactions
  getAllTransactions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`, { headers: this.getAuthHeaders() });
  }

  // 🔹 Update transaction status (for Admin/Manager)
  updateTransactionStatus(txId: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${txId}/status?status=${status}`, {}, { headers: this.getAuthHeaders() });
  }

  getTransactionsByUser(userId: number): Observable<any> {
    return this.http.get(`https://bankproject-djg3ftb6gkfjcda8.canadacentral-01.azurewebsites.net/api/manager/transactions?userId=${userId}`, { headers: this.getAuthHeaders() });
  }

  makeDeposit(accountId: number, amount: number, remark?: string): Observable<any> {
    const payload = {
      transactionType: 'DEPOSIT',
      amount,
      accountId,
      remark
    };
    return this.http.post(`${this.baseUrl}`, payload, { headers: this.getAuthHeaders() });
  }
}
