import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { NewAccountComponent } from './components/new-account/new-account.component';
import { TableStatusComponent } from './components/table-status/table-status.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'new-account', component: NewAccountComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'table-status', component: TableStatusComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
