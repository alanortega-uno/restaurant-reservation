import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReservationComponent } from './components/reservation/reservation.component';
import { NewAccountComponent } from './components/new-account/new-account.component';

import { SocketService } from './services/socket.service';

import { authenticationReducer } from './state/authentication/authentication.reducer';
import { AuthenticationEffects } from './state/authentication/authentication.effects';
import { tableReducer } from './state/tables/tables.reducer';
import { TableEffects } from './state/tables/tables.effects';
import { TableComponent } from './components/table/table.component';
import { ReservationFormComponent } from './components/reservation/form/form.component';

import { AuthorizationInterceptor } from './interceptors/auth.interceptor';
import { reservationsReducer } from './state/reservations/reservations.reducer';
import { ReservationEffects } from './state/reservations/reservations.effects';
import { TableStatusComponent } from './components/table-status/table-status.component';
import { TableStatusFormComponent } from './components/table-status/form/form.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ReservationConfirmComponent } from './components/reservation/confirm/confirm.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { DatepickerRangePopupComponent } from './components/shared/datepicker-range-popup/datepicker-range-popup.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ReservationComponent,
    NewAccountComponent,
    TableComponent,
    ReservationFormComponent,
    TableStatusComponent,
    TableStatusFormComponent,
    LogoutComponent,
    ReservationConfirmComponent,
    AdminDashboardComponent,
    StatisticsComponent,
    DatepickerRangePopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbNavModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot({
      authentication: authenticationReducer,
      tables: tableReducer,
      reservation: reservationsReducer,
    }),
    EffectsModule.forRoot([
      AuthenticationEffects,
      TableEffects,
      ReservationEffects,
    ]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  providers: [
    SocketService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
