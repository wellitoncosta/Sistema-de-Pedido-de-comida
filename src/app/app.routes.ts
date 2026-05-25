import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { RecoverComponent } from './components/recover/recover';
import { Layout } from './components/layout/layout';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Orders } from './components/orders/orders';
import { Reports } from './components/reports/reports';
import { Favorites } from './components/favorites/favorites';
import { SettingsComponent } from './components/settings/settings';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  {
    path:'',
    component:Login
  },

  {
    path:'register',
    component:Register
  },

  {
    path:'recover',
    component:RecoverComponent
  },

  {
    path:'app',

    component:Layout,
    canActivate:[authGuard],
    
    children:[

      {
        path:'dashboard',
        component:DashboardComponent
      },

      {
        path:'orders',
        component:Orders
      },

      {
        path:'reports',
        component:Reports
      },

      {
        path:'favorites',
        component:Favorites
      },

      {
        path:'settings',
        component: SettingsComponent
      },

      {
        path:'',
        redirectTo:'dashboard',
        pathMatch:'full'
      }
    ]
  }
];