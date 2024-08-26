import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ReservationConfirmComponent } from './confirm.component';
import { TableEntityData, TableStatus } from '@restaurant-reservation/shared';

describe('ConfirmComponent', () => {
  let component: ReservationConfirmComponent;
  let fixture: ComponentFixture<ReservationConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationConfirmComponent],
      imports: [HttpClientModule],
      providers: [NgbActiveModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationConfirmComponent);
    component = fixture.componentInstance;

    const table: TableEntityData = {
      id: 1,
      name: '1',
      capacity: 8,
      status: TableStatus.available,
    };

    const reservationFormValues = {
      name: 'Alan Ortega',
      phone: '75906713',
      numberOfPeople: 6,
    };

    component.table = table;
    component.reservationFormValues = reservationFormValues;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
