import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { HomeComponent } from './home/home.component';
import { IdpComponent } from './MenuSection/idp/idp.component';
import { EnrollComponent } from './Enrollment/enroll/enroll.component';
import { CatalogComponent } from './Catalog/catalog/catalog.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    component: HomeComponent
  },
  {
    path: 'IDP',
    component:IdpComponent
  }, 
  {
    path: 'myenrollments',
    component:EnrollComponent
  }, 
  {
    path: 'coursecatalog',
    component:CatalogComponent
  }, 
  {
    path:'**',
    component:NotFoundPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
