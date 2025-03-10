import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/toast/toast.component';
import { ToastMessage, ToastService } from './services/toast.service';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,SideBarComponent,CommonModule,NavBarComponent, ToastComponent, ConfirmModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'morphine-front';
  toasts$: Observable<ToastMessage[]>;

  toastMessage: ToastMessage | null = null;

  constructor(private readonly toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }
  isSidebarOpen = false;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  removeToast(id: number): void {
    this.toastService.removeToast(id);
  }
 
}
