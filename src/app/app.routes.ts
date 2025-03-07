import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CustomersListComponent } from './components/customer-list/customer-list.component';
import { AuthGuard } from '../guards/auth.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'customers', component: CustomersListComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full'},
];
