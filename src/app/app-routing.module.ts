import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { HomeComponent } from './home/home.component';
import { IdpComponent } from './MenuSection/idp/idp.component';
import { EnrollComponent } from './Enrollment/enroll/enroll.component';
import { CatalogComponent } from './Catalog/catalog/catalog.component';
import { TranscriptComponent } from './Training-Transcript/transcript/transcript.component';
import { LoginComponent } from './Login/login/login.component';
import { AuthGuard } from './Login/auth.guard';
import { AdmindashboardComponent } from './AdminDashboard/admindashboard/admindashboard.component';
import { TraningComponent } from './Traning/traning/traning.component';
 
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'studentdashboard',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Dashboard',
    component: AdmindashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Training',
    component: TraningComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'IDP',
    component:IdpComponent,
    canActivate: [AuthGuard]
  }, 
  {
    path: 'myenrollments',
    component:EnrollComponent,
    canActivate: [AuthGuard]
  }, 
  {
    path: 'coursecatalog',
    component:CatalogComponent,
    canActivate: [AuthGuard]
  }, 
  {
    path: 'transcript',
    component:TranscriptComponent,
    canActivate: [AuthGuard]
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
