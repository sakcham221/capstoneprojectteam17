import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuthGuardService } from './services/auth.guard.service';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login/:role', component: LoginComponent },
  { path: 'register', component: RegisterComponent },          // Public user
  { path: 'register/:role', component: RegisterComponent },    // Admin creates other roles
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService], data: { roles: ['USER'] } },
  { path: 'manager-dashboard', component: ManagerDashboardComponent, canActivate: [AuthGuardService], data: { roles: ['MANAGER'] } },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuardService], data: { roles: ['ADMIN'] } },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
