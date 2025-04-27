import { Component, OnInit } from '@angular/core';
import { ModalService, ModalRequest } from '../../core/services/modal.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('120ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('contentAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms 50ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('120ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class ConfirmModalComponent implements OnInit {
  isOpen = false;
  message = '';
  title = '';
  currentRequest: ModalRequest | null = null;

  constructor(private readonly modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modalRequest$.subscribe((request) => {
      this.currentRequest = request;
      this.message = request.options.message;
      this.title = request.options.title || 'Confirm';
      this.isOpen = true;
    });
  }

  onConfirm(): void {
    if (this.currentRequest) {
      this.currentRequest.response.next(true);
      this.currentRequest.response.complete();
    }
    this.isOpen = false;
  }

  onCancel(): void {
    if (this.currentRequest) {
      this.currentRequest.response.next(false);
      this.currentRequest.response.complete();
    }
    this.isOpen = false;
  }
}
