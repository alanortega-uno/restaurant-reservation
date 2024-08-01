import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { ReservationConfirmComponent } from './confirm.component';

describe('ConfirmComponent', () => {
  let component: ReservationConfirmComponent;
  let fixture: ComponentFixture<ReservationConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservationConfirmComponent],
      imports: [HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
