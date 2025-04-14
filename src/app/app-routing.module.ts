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
import { ConfigurationComponent } from './Configuration/Config/configuration.component';
import { EditTrainingComponent } from './Training/edit-training/edit-training.component';
import { ViewprofileComponent } from './Student/viewprofile/viewprofile.component';
import { ForgetpasswordComponent } from './Login/forgetpassword/forgetpassword.component';
import { RegisterComponent } from './Login/register/register.component';
import { DocumentViewerComponent } from './Catalog/document-viewer/document-viewer.component';
import { UnauthorizedpageComponent } from './not-found-page/unauthorizedpage/unauthorizedpage.component';
import { DisplayStatusComponent } from './AI-Maintenance/display-status/display-status.component';

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
    data: { roles: ['Admin'] }
  },
  {
    path: 'editStudent/:studentId',
    component: AddeditstudentComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'viewProfile',
    component: ViewprofileComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Student'] }
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
    canActivate: [AuthGuard],
    data: { roles: ['Student','Admin']}

  },
  {
    path: 'dashboard',
    component: AdmindashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] }

  },
  {
    path: 'training',
    component: TrainingComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'add-training',
    component: AddEditTrainingComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'edit-training/:id',
    component: EditTrainingComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'AI-Maintenance',
    component: PendingApprovalComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'Display-Status',
    component: DisplayStatusComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'Configuration',
    component: ConfigurationComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'Student',
    component: DisplaystudentComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'IDP',
    component:IdpComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Student','Admin'] }

  },
  {
    path: 'myenrollments',
    component:EnrollComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Student','Admin'] }
  },
  {
    path: 'coursecatalog',
    component:CatalogComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Student','Admin'] }
  },
  {
    path: 'documentpdfviewer',
    component:DocumentViewerComponent ,
    data: { roles: ['Student','Admin'] }
  },
  {
    path: 'transcript',
    component:TranscriptComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Student','Admin'] }
  },
  {
    path:'unauthorized',
    component: UnauthorizedpageComponent
  },
  {
    path:'**',
    component:NotFoundPageComponent,
    data: { roles: ['Admin','Student'] }
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
