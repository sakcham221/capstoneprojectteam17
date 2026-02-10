import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTransactionsDialogComponent } from './all-transactions-dialog.component';

describe('AllTransactionsDialogComponent', () => {
  let component: AllTransactionsDialogComponent;
  let fixture: ComponentFixture<AllTransactionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllTransactionsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTransactionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
