// src/app/services/toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'success' | 'danger' | 'warning';

export interface ToastMessage {
  type: ToastType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  toast$: Observable<ToastMessage | null> = this.toastSubject.asObservable();

  showToast(message: string, type: ToastType, duration = 3000): void {
    const toast: ToastMessage = { type, message };
    this.toastSubject.next(toast);
    setTimeout(() => {
      this.toastSubject.next(null);
    }, duration);
  }
}
