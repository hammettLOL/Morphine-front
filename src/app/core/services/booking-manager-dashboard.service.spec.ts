import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BookingManagerDashboardService } from './booking-manager-dashboard.service';

describe('BookingManagerDashboardService', () => {
  let service: BookingManagerDashboardService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BookingManagerDashboardService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('pide las comisiones del mes con anio y mes', () => {
    service.getMonthlyCommissions(2026, 6).subscribe(r => expect(r.totalComision).toBe(200));

    const req = http.expectOne(r =>
      r.url.endsWith('/api/dashboard-bm/comisiones')
      && r.params.get('year') === '2026'
      && r.params.get('month') === '6');
    expect(req.request.method).toBe('GET');
    req.flush({ totalComision: 200 });
  });
});
