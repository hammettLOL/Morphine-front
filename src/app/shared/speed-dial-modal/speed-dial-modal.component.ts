import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-speed-dial-modal',
  imports: [],
  templateUrl: './speed-dial-modal.component.html',
  styleUrl: './speed-dial-modal.component.css'
})
export class SpeedDialModalComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() generateLink = new EventEmitter<void>();
  @Output() addCustomer = new EventEmitter<void>();

}
