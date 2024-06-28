import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import {
  Reservation,
  TableEntityData,
  TableStatus,
} from '@restaurant-reservation/shared';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  cancelReservation,
  makeReservation,
  updateReservation,
} from 'src/app/state/reservations/reservations.actions';
import { selectReservation } from 'src/app/state/reservations/reservations.selectors';
import { selectAllTables } from 'src/app/state/tables/tables.selectors';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
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

  sendingApiRequest = false;
  blocked = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private store: Store
  ) {
    this.reservation$ = this.store.select(selectReservation);
    this.reservation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((activeReservation) => {
        if (activeReservation) this.activeReservation = activeReservation;
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
        this.activeReservation?.number_of_people ?? 2,
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

  createReservation() {
    const { name, phone, numberOfPeople } = this.reservationForm.value;

    this.store.dispatch(
      makeReservation({
        tableId: this.table.id,
        name: name as string,
        phone: phone as string,
        numberOfPeople: Number(numberOfPeople),
      })
    );
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
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
