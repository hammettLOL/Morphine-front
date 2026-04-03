export interface BookingManagerDashboard {
  periodStart: string;
  periodEnd: string;
  totalAgendado: number;
  meta: number;
  faltaParaMeta: number;
  comisionExtra: number;
  metaAlcanzada: boolean;
  orders: BookingManagerOrder[];
}

export interface BookingManagerOrder {
  id: number;
  scheduleDate: string;
  customerName: string;
  totalPrice: number;
  status: string;
}
