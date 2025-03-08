import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastType = 'success' | 'danger' | 'warning';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  @Input() type: ToastType = 'success';
  @Input() message: string = '';
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  get iconClasses(): string {
    switch (this.type) {
      case 'success':
        return 'w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200';
      case 'danger':
        return 'w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200';
      case 'warning':
        return 'w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200';
      default:
        return '';
    }
  }
}
