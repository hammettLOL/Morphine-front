import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CustomersListComponent } from './features/Customer/customer-list/customer-list.component';
import { AuthGuard } from '../guards/auth.guard';
import { AddCustomerComponent } from './features/Customer/add-customer/add-customer.component';
import { HomeComponent } from './components/home/home.component';
import { NoAuthGuard } from '../guards/no-auth.guard';
import { AddServiceComponent } from './features/Service/add-service/add-service.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddWorkOrderComponent } from './features/WorkOrder/add-work-order/add-work-order.component';
import { WorkOrderListComponent } from './features/WorkOrder/work-order-list/work-order-list.component';
import { CustomerDetailComponent } from './features/Customer/customer-detail/customer-detail.component';
import { AddCustomerPublicComponent } from './features/Customer/add-customer-public/add-customer-public.component';
import { AccountingListComponent } from './features/Accounting/accounting-list/accounting-list.component';


export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'customers', component: CustomersListComponent, canActivate: [AuthGuard] },
  { path: 'accounting', component: AccountingListComponent, canActivate: [AuthGuard] },
  { path: 'customer/detail/:id', component: CustomerDetailComponent, canActivate: [AuthGuard] },
  { path: 'add-customer-public/:token', component: AddCustomerPublicComponent, data:{ hideSidebar: true, canActivate:[NoAuthGuard] } },
  { path: 'work-orders', component: WorkOrderListComponent, canActivate: [AuthGuard] },
  { path: 'add-service', component: AddServiceComponent, canActivate: [AuthGuard]},
  { path: 'add-customer', component: AddCustomerComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '/', pathMatch: 'full'},
];
