import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CustomersListComponent } from './features/Customer/customer-list/customer-list.component';
import { AuthGuard } from '../guards/auth.guard';
import { EditCustomerComponent } from './features/Customer/edit-customer/edit-customer.component';
import { AddCustomerComponent } from './features/Customer/add-customer/add-customer.component';
import { HomeComponent } from './components/home/home.component';
import { NoAuthGuard } from '../guards/no-auth.guard';
import { ServicesListComponent } from './features/Service/service-list/service-list.component';
import { AddServiceComponent } from './features/Service/add-service/add-service.component';
import { EditServiceComponent } from './features/Service/edit-service/edit-service.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'customers', component: CustomersListComponent, canActivate: [AuthGuard] },
  { path: 'services', component: ServicesListComponent, canActivate: [AuthGuard] },
  { path: 'add-service', component: AddServiceComponent, canActivate: [AuthGuard]},
  { path: 'edit-service/:id', component: EditServiceComponent, canActivate: [AuthGuard]},
  { path: 'edit-customer/:id', component: EditCustomerComponent, canActivate: [AuthGuard]},
  { path: 'add-customer', component: AddCustomerComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '/', pathMatch: 'full'},
];
