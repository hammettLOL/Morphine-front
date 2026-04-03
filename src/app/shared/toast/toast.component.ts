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
  @Input() id: number = 0;
  @Output() closed = new EventEmitter<number>();

  close(): void {
    this.closed.emit(this.id!);
  }

  get iconClasses(): string {
    switch (this.type) {
      case 'success':
        return 'w-8 h-8 text-green-200 bg-green-800 rounded-lg';
      case 'danger':
        return 'w-8 h-8 text-red-200 bg-red-800 rounded-lg';
      case 'warning':
        return 'w-8 h-8 text-orange-200 bg-orange-700 rounded-lg';
      default:
        return '';
    }
  }
}
