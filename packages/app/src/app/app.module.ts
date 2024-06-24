import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReservationComponent } from './components/reservation/reservation.component';
import { NewAccountComponent } from './components/new-account/new-account.component';

import { SocketService } from './services/socket.service';

import { authenticationReducer } from './state/authentication/authentication.reducer';
import { AuthenticationEffects } from './state/authentication/authentication.effects';
import { tableReducer } from './state/tables/tables.reducer';
import { TableEffects } from './state/tables/tables.effects';
import { TableComponent } from './components/reservation/table/table.component';
import { FormComponent } from './components/reservation/form/form.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ReservationComponent,
    NewAccountComponent,
    TableComponent,
    FormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot({
      authentication: authenticationReducer,
      tables: tableReducer,
    }),
    EffectsModule.forRoot([AuthenticationEffects, TableEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
  ],
  providers: [SocketService],
  bootstrap: [AppComponent],
})
export class AppModule {}
