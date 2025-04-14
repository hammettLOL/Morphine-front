import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerPublicComponent } from './add-customer-public.component';

describe('AddCustomerPublicComponent', () => {
  let component: AddCustomerPublicComponent;
  let fixture: ComponentFixture<AddCustomerPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCustomerPublicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCustomerPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
