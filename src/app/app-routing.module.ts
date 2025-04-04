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
import { TrainingComponent } from './Training/training/training.component';
import { PendingApprovalComponent } from './AI-Maintenance/pending-approval/pending-approval.component';
import { DisplaystudentComponent } from './Student/displaystudent/displaystudent.component';
import { AddeditstudentComponent } from './Student/addeditstudent/addeditstudent.component';
import { AddEditTrainingComponent } from './Training/add-edit-training/add-edit-training.component';
import { ViewprofileComponent } from './Student/viewprofile/viewprofile.component';
import { ForgetpasswordComponent } from './Login/forgetpassword/forgetpassword.component';
import { RegisterComponent } from './Login/register/register.component';
import { DocumentViewerComponent } from './Catalog/document-viewer/document-viewer.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: []
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'addStudent',
    component: AddeditstudentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editStudent/:studentId',
    component: AddeditstudentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'viewProfile',
    component: ViewprofileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ForgetPassword',
    component: ForgetpasswordComponent,
  },
  {
    path: 'SelfRegister',
    component: RegisterComponent,
  },
  {
    path: 'studentdashboard',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: AdmindashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'training',
    component: TrainingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-training',
    component: AddEditTrainingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-training',
    component: AddEditTrainingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'AI-Maintenance',
    component: PendingApprovalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Student',
    component: DisplaystudentComponent,
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
    path: 'documentpdfviewer',
    component:DocumentViewerComponent 
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
