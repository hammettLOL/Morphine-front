import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  @Input() isOpen: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();

  // Para que el sidebar se comporte igual en todos los tamaños, no se aplica lógica condicional de mobile
  onClose(): void {
    this.closeSidebar.emit();
  }

  onLogout(){
    this.authService.logout();
  }
}
