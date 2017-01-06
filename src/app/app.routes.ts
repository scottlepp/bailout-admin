import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login';
import { BondsComponent } from '../reports/bonds';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'bonds',
    component: BondsComponent
  },
  { path: '',
    redirectTo: '/login',
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
