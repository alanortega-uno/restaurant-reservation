import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  combineLatest,
  filter,
  first,
  map,
  of,
  switchMap,
  take,
  takeLast,
  takeUntil,
  withLatestFrom,
} from 'rxjs';
import { loadTables } from 'src/app/state/tables/tables.actions';
import {
  selectAllTables,
  selectTableApiRequestStatus,
} from 'src/app/state/tables/tables.selectors';
import {
  ApiRequestStatus,
  Reservation,
  SocketEvents,
  TableEntityData,
  TableStatus,
} from '@restaurant-reservation/shared';
import { Router } from '@angular/router';
import { ReservationFormComponent } from './form/form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { loadReservation } from 'src/app/state/reservations/reservations.actions';
import { selectReservation } from 'src/app/state/reservations/reservations.selectors';
import { SocketService } from 'src/app/services/socket.service';
@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  accountEmail!: string | null;
  tables$: Observable<TableEntityData[]>;
  reservation$: Observable<Reservation | null>;

  apiTableRequestStatus$: Observable<{ status: ApiRequestStatus; error: any }>;
  // activeReservation$: Observable<Reservation | null>;
  apiRequestStatus = ApiRequestStatus;
  tableStatus = TableStatus;

  vm$: Observable<{
    apiRequestStatus: { status: ApiRequestStatus; error: any };
    tables: TableEntityData[];
  }>;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router,
    public modalService: NgbModal,
    private socketService: SocketService
  ) {
    this.tables$ = this.store.select(selectAllTables);
    this.apiTableRequestStatus$ = this.store.select(
      selectTableApiRequestStatus
    );

    this.reservation$ = this.store.select(selectReservation);
    this.reservation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((reservation) => {
        if (
          reservation &&
          reservation.table &&
          !this.modalService.hasOpenModals()
        ) {
          this.openForm(reservation.table, reservation);
        }
      });

    this.socketService.listen(SocketEvents.updateTables).subscribe(() => {
      this.store.dispatch(loadTables());
    });

    this.socketService
      .listen(SocketEvents.updateTablesAndReservation)
      .subscribe(() => {
        this.store.dispatch(loadTables());
        this.store.dispatch(loadReservation());
      });

    this.vm$ = combineLatest([this.apiTableRequestStatus$, this.tables$]).pipe(
      map(([apiRequestStatus, tables]) => ({ apiRequestStatus, tables }))
    );
  }

  ngOnInit(): void {
    if (
      !sessionStorage.getItem('accessToken') ||
      !sessionStorage.getItem('refreshToken') ||
      !sessionStorage.getItem('email')
    ) {
      this.router.navigate(['login']);
    }

    this.accountEmail = sessionStorage.getItem('email');

    this.store.dispatch(loadTables());
    this.store.dispatch(loadReservation());
  }

  openForm(table: TableEntityData, activeReservation?: Reservation) {
    const modalRef = this.modalService.open(ReservationFormComponent, {
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.table = table;
    modalRef.componentInstance.activeReservation = activeReservation;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
