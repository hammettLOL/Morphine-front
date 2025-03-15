import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CustomersListComponent } from './components/customer-list/customer-list.component';
import { AuthGuard } from '../guards/auth.guard';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { HomeComponent } from './components/home/home.component';
import { NoAuthGuard } from '../guards/no-auth.guard';
import { ServicesListComponent } from './components/service-list/service-list.component';
import { AddServiceComponent } from './components/add-service/add-service.component';
import { EditServiceComponent } from './components/edit-service/edit-service.component';


export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'customers', component: CustomersListComponent, canActivate: [AuthGuard] },
  { path: 'services', component: ServicesListComponent, canActivate: [AuthGuard] },
  { path: 'add-service', component: AddServiceComponent, canActivate: [AuthGuard]},
  { path: 'edit-service/:id', component: EditServiceComponent, canActivate: [AuthGuard]},
  { path: 'edit-customer/:id', component: EditCustomerComponent, canActivate: [AuthGuard]},
  { path: 'add-customer', component: AddCustomerComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '/', pathMatch: 'full'},
];
