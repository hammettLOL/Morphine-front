import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountingWorkOrder } from '../../../core/models/accounting-work-order.model';
import { AccountingService } from '../../../core/services/accounting.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-accounting-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './accounting-list.component.html',
  styleUrl: './accounting-list.component.css'
})
export class AccountingListComponent implements OnInit {
  fb = new FormBuilder();
  periodForm = this.fb.group({
    year:[new Date().getFullYear(), Validators.required],
    month:[new Date().getMonth()  + 1, Validators.required],
  });
  years: number[] = [];
  months = [
    {value: 1, name: 'Enero'},
    {value: 2, name: 'Febrero'},
    {value: 3, name: 'Marzo'},
    {value: 4, name: 'Abril'},
    {value: 5, name: 'Mayo'},
    {value: 6, name: 'Junio'},
    {value: 7, name: 'Julio'},
    {value: 8, name: 'Agosto'},
    {value: 9, name: 'Setiembre'},
    {value: 10, name: 'Octubre'},
    {value: 11, name: 'Noviembre'},
    {value: 12, name: 'Diciembre'}
  ];

  accountingWorkOrders: AccountingWorkOrder[] = [];
  totalAmount: number = 0;
  today = new Date();

  constructor(
    private readonly accountingService: AccountingService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit(): void {
    // rellenar años desde 2000 hasta año actual
    const currentYear = this.today.getFullYear();
    for (let y = 2024; y <= currentYear; y++) {
      this.years.push(y);
    }
    this.limitMonth();
    this.loadAccountingWorkOrders();
  }
  paymentMethodMap: { [key: number]: string } = {
    0: 'Plin',
    1: 'Yape',
    2: 'Efectivo',
    3: 'Tarjeta',
    4: 'Transferencia'
  };
   // Impide elegir mes/año en el futuro
   limitMonth() {
    const y = this.periodForm.value.year!;
    if (y === this.today.getFullYear() && this.periodForm.value.month! > this.today.getMonth() + 1) {
      this.periodForm.patchValue({ month: this.today.getMonth() + 1 });
    }
  }

  loadAccountingWorkOrders() {
    this.accountingService.getAccountingWorkOrders(this.periodForm.value.year!, this.periodForm.value.month!).subscribe((data) => {
      this.accountingWorkOrders = data.items.map(o => {
        const wo :AccountingWorkOrder= {
          id: o.id,
          workOrderId: o.workOrderId,
          customerName: o.customerName,
          dni: o.dni,
          email: o.email,
          schedulerName: o.schedulerName,
          scheduledDate: o.scheduledDate,
          paymentMethod: o.paymentMethod,
          advancePrice: o.advancePrice,
          totalPrice: o.totalPrice,
          verified: o.verified,
          remarks: o.remarks,
          emitted: o.emitted,
          amount: o.amount,
          original: {
            verified: o.verified,
            remarks: o.remarks,
            emitted: o.emitted,
            amount: o.amount,
          },
          isModified: false
        };
        return wo;
      });



      this.totalAmount = data.totalAmount;
      console.log(this.accountingWorkOrders);
    });
  }

  onFieldChange(wo: AccountingWorkOrder) {
    const o = wo.original;
    wo.isModified =
      wo.verified  !== o.verified   ||
      wo.remarks   !== o.remarks  ||
      wo.emitted   !== o.emitted      ||
      wo.amount    !== o.amount;
  }
  

  onPeriodChange() {
    this.limitMonth();
    this.loadAccountingWorkOrders();
  } 
  
  saveRow(wo: AccountingWorkOrder) {
    this.accountingService.update(wo.id, wo).subscribe({
      next: () => {
        this.toastService.showToast('Datos guardados correctamente', 'success');
        this.loadAccountingWorkOrders();
      },
      error: (err) => {
        this.toastService.showToast('Error al guardar los datos', 'danger');
      }
    });
  }

}
