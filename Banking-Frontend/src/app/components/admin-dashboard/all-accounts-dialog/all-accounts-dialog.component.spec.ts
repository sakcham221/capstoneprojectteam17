import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAccountsDialogComponent } from './all-accounts-dialog.component';

describe('AllAccountsDialogComponent', () => {
  let component: AllAccountsDialogComponent;
  let fixture: ComponentFixture<AllAccountsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllAccountsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllAccountsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
