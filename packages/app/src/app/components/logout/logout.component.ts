import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { clearAccount } from 'src/app/state/authentication/authentication.actions';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  accountEmail!: string | null;
  constructor(
    public modalService: NgbModal,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.accountEmail = sessionStorage.getItem('email');
  }

  openModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, {
        backdrop: 'static',
        keyboard: false,
      })
      .result.then((yes) => {
        if (yes) {
          this.closeSession();
        }
      });
  }

  private closeSession() {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');

    this.store.dispatch(clearAccount());

    this.router.navigate(['login']);
  }
}
