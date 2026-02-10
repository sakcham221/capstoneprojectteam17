import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTransactionsDialogComponent } from './user-transactions-dialog.component';

describe('UserTransactionsDialogComponent', () => {
  let component: UserTransactionsDialogComponent;
  let fixture: ComponentFixture<UserTransactionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserTransactionsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTransactionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
