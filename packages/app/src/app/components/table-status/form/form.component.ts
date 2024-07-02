import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  Reservation,
  TableEntityData,
  TableStatus,
} from '@restaurant-reservation/shared';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAllTables } from 'src/app/state/tables/tables.selectors';
import { TableStatusService } from 'src/app/services/table-status.service';
import { selectReservation } from 'src/app/state/reservations/reservations.selectors';
import {
  loadReservation,
  loadReservationByTable,
} from 'src/app/state/reservations/reservations.actions';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class TableStatusFormComponent implements OnInit {
  tableStatusForm!: FormGroup<{
    status: FormControl<TableStatus | null>;
  }>;

  reservationForm!: FormGroup<{
    name: FormControl<string | null>;
    phone: FormControl<string | null>;
    numberOfPeople: FormControl<number | null>;
  }>;

  activeReservation: Reservation | null = null;

  // tables$: Observable<TableEntityData[]>;
  reservation$: Observable<Reservation | null>;

  @Input() table!: TableEntityData;

  tableStatus = TableStatus;
  tableStatusKeyValue = this.enumToArray(TableStatus);

  private readonly destroy$ = new Subject<void>();

  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private store: Store,
    private tableStatusService: TableStatusService,
    private socketService: SocketService
  ) {
    // this.tables$ = this.store.select(selectAllTables);

    this.reservation$ = this.store.select(selectReservation);
    this.reservation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((reservation) => {
        console.log('reservation', reservation);
        if (reservation) {
          this.reservationForm.setValue({
            name: reservation.name,
            phone: reservation.phone,
            numberOfPeople: (reservation as any).numberOfPeople,
          });
        }
      });
  }

  ngOnInit(): void {
    this.tableStatusForm = this.formBuilder.group({
      status: [this.table.status],
    });

    this.store.dispatch(
      loadReservationByTable({ tableId: String(this.table.id) })
    );

    this.reservationForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('\\d{8}')]],
      numberOfPeople: [
        2,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(this.table.capacity),
        ],
      ],
    });
  }

  private enumToArray<T extends object>(
    enumObj: T
  ): { key: string; value: number }[] {
    return Object.keys(enumObj)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        key: key,
        value: (enumObj as any)[key],
      }));
  }

  updateTableStatus() {
    const newTableStatus = Number(
      this.tableStatusForm.get('status')?.value
    ) as TableStatus;
    // if (newTableStatus !== undefined && newTableStatus !== null) {
    //   this.table.status = newTableStatus;
    // }

    const newTable: TableEntityData = {
      ...this.table,
      status: newTableStatus,
    };
    console.log(newTable);

    const reservationFormValues: {
      name: string;
      phone: string;
      numberOfPeople: number;
    } = {
      name: this.reservationForm.value.name ?? '',
      phone: this.reservationForm.value.phone ?? '',
      numberOfPeople: Number(this.reservationForm.value.numberOfPeople) ?? 2,
    };

    this.tableStatusService
      .updateTableStatus(newTable, reservationFormValues)
      .subscribe((response) => console.log('updateTableStatus', response));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
