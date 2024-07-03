import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationConfirmComponent } from './confirm.component';

describe('ConfirmComponent', () => {
  let component: ReservationConfirmComponent;
  let fixture: ComponentFixture<ReservationConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationConfirmComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
