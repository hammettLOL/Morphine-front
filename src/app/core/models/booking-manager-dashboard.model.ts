export interface BookingManagerDashboard {
  periodStart: string;
  periodEnd: string;
  totalAgendado: number;
  meta: number;
  faltaParaMeta: number;
  pagoFijo: number;
  comisionExtra: number;
  totalComision: number;
  metaAlcanzada: boolean;
  orders: BookingManagerOrder[];
}

export type TipoComision = 'Ninguna' | 'Meta' | 'Extra';

export interface BookingManagerOrder {
  id: number;
  creationDate: string;
  scheduleDate: string;
  customerName: string;
  totalPrice: number;
  status: string;
  tipoComision: TipoComision;
  comision: number;
}

export interface WeekCommission {
  inicio: string;
  fin: string;
  totalAgendado: number;
  metaAlcanzada: boolean;
  pagoFijo: number;
  comisionExtra: number;
  totalComision: number;
}

export interface MonthlyCommission {
  year: number;
  month: number;
  meta: number;
  montoAgendado: number;
  pagoFijo: number;
  comisionExtra: number;
  totalComision: number;
  semanas: WeekCommission[];
  citas: BookingManagerOrder[];
}
