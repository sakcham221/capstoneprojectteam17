import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTransactionStatusDialogComponent } from './update-transaction-status-dialog.component';

describe('UpdateTransactionStatusDialogComponent', () => {
  let component: UpdateTransactionStatusDialogComponent;
  let fixture: ComponentFixture<UpdateTransactionStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateTransactionStatusDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTransactionStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
