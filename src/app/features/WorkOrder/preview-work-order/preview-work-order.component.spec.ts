import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewWorkOrderComponent } from './preview-work-order.component';

describe('PreviewWorkOrderComponent', () => {
  let component: PreviewWorkOrderComponent;
  let fixture: ComponentFixture<PreviewWorkOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewWorkOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
