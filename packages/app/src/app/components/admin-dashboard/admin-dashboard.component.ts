import { Component, OnInit } from '@angular/core';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  active = 1;
  constructor() {}

  ngOnInit(): void {}
}
