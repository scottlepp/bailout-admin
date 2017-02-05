import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login';
import { BondsComponent } from '../reports/bonds';
import { ReportComponent } from '../reports/report';
import { AuthGuard } from './auth-guard.service';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'bonds',
    component: BondsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'report',
    component: ReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/report',
    pathMatch: 'full'
  }
  // { path: 'hero/:id',      component: HeroDetailComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  // { path: '**', component: PageNotFoundComponent }
];
