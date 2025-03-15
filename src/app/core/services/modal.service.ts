import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ModalOptions {
  message: string;
  title?: string;
}

export interface ModalRequest {
  options: ModalOptions;
  response: Subject<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // Este Subject emitirá cada solicitud de modal
  private readonly modalRequestSubject = new Subject<ModalRequest>();

  // Observable al que se puede suscribir el componente modal
  modalRequest$: Observable<ModalRequest> = this.modalRequestSubject.asObservable();

  // Método que se usa para mostrar un modal de confirmación
  confirm(options: ModalOptions): Observable<boolean> {
    const responseSubject = new Subject<boolean>();
    this.modalRequestSubject.next({ options, response: responseSubject });
    return responseSubject.asObservable();
  }
}
