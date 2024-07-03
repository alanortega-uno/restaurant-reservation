import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TableEntityData } from '@restaurant-reservation/shared';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ReservationConfirmComponent implements OnInit {
  @Input() table!: TableEntityData;
  @Input() reservationFormValues!: {
    name: string | null;
    phone: string | null;
    numberOfPeople: number | null;
  };

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}
