import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { navbarRoute } from './layouts/navbar/navbar.route';


const LAYOUT_ROUTES = [navbarRoute];

const routes: Routes = [
  ...LAYOUT_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
