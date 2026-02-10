import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountsDialogComponent } from './user-accounts-dialog.component';

describe('UserAccountsDialogComponent', () => {
  let component: UserAccountsDialogComponent;
  let fixture: ComponentFixture<UserAccountsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAccountsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccountsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
