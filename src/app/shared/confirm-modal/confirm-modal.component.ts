import { Component, OnInit } from '@angular/core';
import { ModalService, ModalRequest } from '../../core/services/modal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
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
