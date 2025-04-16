import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedDialModalComponent } from './speed-dial-modal.component';

describe('SpeedDialModalComponent', () => {
  let component: SpeedDialModalComponent;
  let fixture: ComponentFixture<SpeedDialModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedDialModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeedDialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
