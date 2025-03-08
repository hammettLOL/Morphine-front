import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CustomersListComponent } from './components/customer-list/customer-list.component';
import { AuthGuard } from '../guards/auth.guard';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'customers', component: CustomersListComponent, canActivate: [AuthGuard] },
  { path: 'edit-customer/:id', component: EditCustomerComponent, canActivate: [AuthGuard]},
  { path: 'add-customer', component: AddCustomerComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '', pathMatch: 'full'},
];
