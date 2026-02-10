import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

// Dashboard Dialogs
import { DepositDialogComponent } from './components/dashboard/deposit-dialog/deposit-dialog.component';
import { WithdrawDialogComponent } from './components/dashboard/withdraw-dialog/withdraw-dialog.component';
import { TransferDialogComponent } from './components/dashboard/transfer-dialog/transfer-dialog.component';
import { BalanceComponent } from './components/dashboard/balance/balance.component';
import { TransactionsComponent } from './components/dashboard/transactions/transactions.component';
import { UpdateProfileComponent } from './components/dashboard/update-profile/update-profile.component';

// Manager Dialogs
import { UserAccountsDialogComponent } from './components/manager-dashboard/user-accounts-dialog/user-accounts-dialog.component';
import { UserTransactionsDialogComponent } from './components/manager-dashboard/user-transactions-dialog/user-transactions-dialog.component';
import { UpdateStatusDialogComponent } from './components/manager-dashboard/update-status-dialog/update-status-dialog.component';
import { ManagerCreateUserDialogComponent } from './components/manager-dashboard/create-user-dialog/create-user-dialog.component';
// Admin Dialogs
import { CreateAdminDialogComponent } from './components/admin-dashboard/create-admin-dialog/create-admin-dialog.component';
import { CreateManagerDialogComponent } from './components/admin-dashboard/create-manager-dialog/create-manager-dialog.component';
import { AssignManagerDialogComponent } from './components/admin-dashboard/assign-manager-dialog/assign-manager-dialog.component';
import { AllTransactionsDialogComponent } from './components/admin-dashboard/all-transactions-dialog/all-transactions-dialog.component';
import { AdminCreateUserDialogComponent as AdminCreateUserDialogComponent } from './components/admin-dashboard/create-user-dialog/create-user-dialog.component';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';

// Services
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth.guard.service';
import { JwtInterceptorService as JwtInterceptor } from './services/jwt.interceptor.service';
import { UpdateTransactionStatusDialogComponent } from './components/admin-dashboard/update-transaction-status-dialog/update-transaction-status-dialog.component';
import { AllAccountsDialogComponent } from './components/admin-dashboard/all-accounts-dialog/all-accounts-dialog.component';
import { CreateAccountDialogComponent } from './components/manager-dashboard/create-account-dialog/create-account-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    DashboardComponent,
    ManagerDashboardComponent,
    AdminDashboardComponent,
    DepositDialogComponent,
    WithdrawDialogComponent,
    TransferDialogComponent,
    BalanceComponent,
    TransactionsComponent,
    UpdateProfileComponent,
    UserAccountsDialogComponent,
    UserTransactionsDialogComponent,
    AdminCreateUserDialogComponent,
    ManagerCreateUserDialogComponent,
    UpdateStatusDialogComponent,
    CreateAdminDialogComponent,
    CreateManagerDialogComponent,
    AssignManagerDialogComponent,
    AllTransactionsDialogComponent,
    UpdateTransactionStatusDialogComponent,
    AllAccountsDialogComponent,
    CreateAccountDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatListModule,
    MatTableModule,
    MatSnackBarModule
  ],
  providers: [
    AuthService,
    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
