import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MENU_ITEMS, MenuItem } from '../../core/config/navigation.config';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
  private readonly authService = inject(AuthService);
  @Input() isOpen: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();

  get visibleMenuItems(): MenuItem[] {
    const role = this.authService.getUserRole();
    if (!role) return [];
    return MENU_ITEMS.filter(item => item.roles.includes(role as any));
  }

  onClose(): void {
    this.closeSidebar.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
