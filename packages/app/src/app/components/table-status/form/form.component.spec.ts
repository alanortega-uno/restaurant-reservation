import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';

import { TableStatusFormComponent } from './form.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TableState } from 'src/app/state/tables/tables.reducer';
import {
  ApiRequestStatus,
  TableEntityData,
} from '@restaurant-reservation/shared';

describe('FormComponent', () => {
  let component: TableStatusFormComponent;
  let fixture: ComponentFixture<TableStatusFormComponent>;

  beforeEach(async () => {
    let store: MockStore;
    const initialTableState: TableState = {
      tables: [],
      error: null,
      status: ApiRequestStatus.pending,
    };

    await TestBed.configureTestingModule({
      declarations: [TableStatusFormComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        NgbActiveModal,
        provideMockStore({ initialState: initialTableState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableStatusFormComponent);
    component = fixture.componentInstance;

    const table: TableEntityData = {
      id: 1,
      name: '1',
      capacity: 8,
      status: 0,
    };
    component.table = table;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
