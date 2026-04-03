import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { getDefaultRouteForRole } from '../../core/config/navigation.config';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();

  constructor(private readonly router: Router) {}

  get userName(): string {
    return localStorage.getItem('userName') || '';
  }

  goToDashboard(): void {
    const role = localStorage.getItem('userRole') || '';
    this.router.navigate([getDefaultRouteForRole(role)]);
  }
}
