import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingListComponent } from './accounting-list.component';

describe('AccountingListComponent', () => {
  let component: AccountingListComponent;
  let fixture: ComponentFixture<AccountingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
