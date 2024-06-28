import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableEntityData } from '@restaurant-reservation/shared';
import { TableStatus } from '@restaurant-reservation/shared';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() data!: TableEntityData;

  tableStatus = TableStatus;

  @Output() openForm: EventEmitter<TableEntityData> = new EventEmitter();

  ngOnInit(): void {}

  onOpenForm() {
    this.openForm.emit(this.data);
  }
}
