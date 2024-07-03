import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import {
  ApiRequestStatus,
  Reservation,
  SocketEvents,
  TableEntityData,
  TableStatus,
} from '@restaurant-reservation/shared';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import {
  cancelReservation,
  loadReservation,
  makeReservation,
  updateReservation,
} from 'src/app/state/reservations/reservations.actions';
import {
  selectReservation,
  selectReservationApiRequestStatus,
} from 'src/app/state/reservations/reservations.selectors';
import { selectAllTables } from 'src/app/state/tables/tables.selectors';
import { ReservationConfirmComponent } from '../confirm/confirm.component';
import { clearAccount } from 'src/app/state/authentication/authentication.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class ReservationFormComponent implements OnInit {
  @Input() table!: TableEntityData;
  @Input() activeReservation!: Reservation;

  @Output() close: EventEmitter<any> = new EventEmitter();

  reservationForm!: FormGroup<{
    name: FormControl<string | null>;
    phone: FormControl<string | null>;
    numberOfPeople: FormControl<number | null>;
  }>;

  reservation$: Observable<Reservation | null>;
  tables$: Observable<TableEntityData[]>;

  reservationApiRequestStatus$!: Observable<ApiRequestStatus>;
  isLoading = false;

  // if your table has been just taken/reserved
  blocked = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public formBuilder: FormBuilder,
    private router: Router,
    private store: Store,
    private socketService: SocketService
  ) {
    this.reservation$ = this.store.select(selectReservation);
    this.reservation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((activeReservation) => {
        // console.log('activeReservation', activeReservation);
        if (activeReservation) this.activeReservation = activeReservation;
        else this.activeModal.close();
      });

    this.reservationApiRequestStatus$ = this.store.select(
      selectReservationApiRequestStatus
    );
    this.reservationApiRequestStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        if (status === ApiRequestStatus.loading) this.isLoading = true;
        else this.isLoading = false;
      });

    this.tables$ = this.store.select(selectAllTables);
    this.tables$.pipe(takeUntil(this.destroy$)).subscribe((tables) => {
      if (tables.length === 0) return;

      const updatedTable = tables.find((table) => table.id === this.table.id);

      if (
        !this.activeReservation &&
        updatedTable?.status !== TableStatus.available
      ) {
        this.blocked = true;
      }
    });

    this.socketService
      .listen(SocketEvents.updateReservation)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        const reservationId = data?.reservationId;

        if (reservationId === this.activeReservation.id) {
          this.store.dispatch(loadReservation());
        }
      });
  }

  ngOnInit(): void {
    console.log('FORM', this.activeReservation);
    this.reservationForm = this.formBuilder.group({
      name: [this.activeReservation?.name ?? '', Validators.required],
      phone: [
        this.activeReservation?.phone ?? '',
        [Validators.required, Validators.pattern('\\d{8}')],
      ],
      numberOfPeople: [
        (this.activeReservation as any)?.numberOfPeople ?? 2,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(this.table.capacity),
        ],
      ],
    });
  }

  cancelReservation() {
    if (this.activeReservation) {
      this.store.dispatch(
        cancelReservation({ reservationId: this.activeReservation.id })
      );
    }
    this.activeModal.close();
  }

  openConfirmModal() {
    const modalRef = this.modalService.open(ReservationConfirmComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
    });

    modalRef.componentInstance.table = this.table;
    modalRef.componentInstance.reservationFormValues =
      this.reservationForm.value;

    modalRef.closed.pipe(takeUntil(this.destroy$)).subscribe((yes: boolean) => {
      if (yes && !this.blocked) {
        this.activeReservation
          ? this.updateReservation()
          : this.createReservation();
      }
    });
  }

  createReservation() {
    const { name, phone, numberOfPeople } = this.reservationForm.value;

    // this.openConfirmModal();
    this.store.dispatch(
      makeReservation({
        tableId: this.table.id,
        name: name as string,
        phone: phone as string,
        numberOfPeople: Number(numberOfPeople),
      })
    );

    this.activeModal.close();
    this.closeSession();
  }

  updateReservation() {
    if (!this.activeReservation) return;

    const { name, phone, numberOfPeople } = this.reservationForm.value;

    if (!name || !phone || !numberOfPeople) return;

    this.store.dispatch(
      updateReservation({
        reservationId: this.activeReservation.id,
        name,
        phone,
        numberOfPeople,
      })
    );

    this.activeModal.close();
    this.closeSession();
  }

  private closeSession() {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');

    this.store.dispatch(clearAccount());

    this.router.navigate(['login']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
