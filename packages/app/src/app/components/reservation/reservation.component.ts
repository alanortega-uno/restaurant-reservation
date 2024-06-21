import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadTables } from 'src/app/state/tables/tables.actions';
import { selectAllTables } from 'src/app/state/tables/tables.selectors';
import { Table } from '@restaurant-reservation/shared';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  tables$: Observable<Table[]>;

  constructor(private store: Store) {
    this.tables$ = this.store.select(selectAllTables);
  }

  ngOnInit(): void {
    this.store.dispatch(loadTables());
  }
}
