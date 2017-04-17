//import { ModuleWithProviders } from '@angular/core';
import { Routes } from '@angular/router';

import { Profile } from '../pages/profile/profile';
import { Dashboard } from '../pages/dashboard/dashboard';

export const appRoutes: Routes = [
  { path: 'dash', component: Dashboard },
  { path: 'profile', component: Profile },
  { path: '', redirectTo: 'dash', pathMatch: 'full' }
];
