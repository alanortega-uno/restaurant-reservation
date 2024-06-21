import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadTables } from 'src/app/state/tables/tables.actions';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadTables());
  }
}
