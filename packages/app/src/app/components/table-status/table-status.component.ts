import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { ApiRequestStatus, SocketEvents } from '@restaurant-reservation/shared';
import { TableEntityData } from '@restaurant-reservation/shared';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from 'src/app/services/socket.service';
import {
  selectAllTables,
  selectTableApiRequestStatus,
} from 'src/app/state/tables/tables.selectors';
import { loadTables } from 'src/app/state/tables/tables.actions';
import { TableStatusFormComponent } from './form/form.component';

@Component({
  selector: 'app-table-status',
  templateUrl: './table-status.component.html',
  styleUrls: ['./table-status.component.scss'],
})
export class TableStatusComponent implements OnInit {
  tables$: Observable<TableEntityData[]>;
  apiTableRequestStatus$: Observable<{ status: ApiRequestStatus; error: any }>;

  vm$: Observable<{
    apiRequestStatus: { status: ApiRequestStatus; error: any };
    tables: TableEntityData[];
  }>;

  apiRequestStatus = ApiRequestStatus;
  accountEmail!: string | null;

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

    this.vm$ = combineLatest([this.apiTableRequestStatus$, this.tables$]).pipe(
      map(([apiRequestStatus, tables]) => ({ apiRequestStatus, tables }))
    );

    this.socketService.listen(SocketEvents.updateTables).subscribe(() => {
      this.store.dispatch(loadTables());
    });
    this.socketService
      .listen(SocketEvents.updateTablesAndReservation)
      .subscribe(() => {
        this.store.dispatch(loadTables());
      });
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
  }

  openForm(table: TableEntityData) {
    const modalRef = this.modalService.open(TableStatusFormComponent, {
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.table = table;
  }
}
