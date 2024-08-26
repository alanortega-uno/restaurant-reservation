import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TableStatusComponent } from './table-status.component';
import { TableState } from 'src/app/state/tables/tables.reducer';
import { ApiRequestStatus } from '@restaurant-reservation/shared';

describe('TableStatusComponent', () => {
  let component: TableStatusComponent;
  let fixture: ComponentFixture<TableStatusComponent>;

  let store: MockStore;
  const initialTableState: TableState = {
    tables: [],
    error: null,
    status: ApiRequestStatus.pending,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableStatusComponent],
      providers: [provideMockStore({ initialState: initialTableState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TableStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
