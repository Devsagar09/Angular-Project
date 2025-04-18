import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {IconModule} from '@progress/kendo-angular-icons';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { HomeComponent } from './home/home.component';

import { CardModule } from '@progress/kendo-angular-layout';
import { AvatarModule } from '@progress/kendo-angular-layout';

import { ChartsModule } from '@progress/kendo-angular-charts';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './Shared/footer/footer.component';

import {DialogModule } from "@progress/kendo-angular-dialog";
import {InputsModule} from '@progress/kendo-angular-inputs';
import {FormsModule} from '@angular/forms';
import { IdpModule } from './MenuSection/idp.module';
import { UserNavigationComponent } from './user-navigation/user-navigation.component';
import { EnrollModule } from './Enrollment/enroll.module';
import { LoaderComponent } from './Shared/loader/loader.component';
import { LoginModule } from './Login/login.module';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { AdmindashboardModule } from './AdminDashboard/admindashboard.module';
import { TrainingModule } from './Training/training.module';
import { PendingApprovalModule } from './AI-Maintenance/pending-approval.module';
import { StudentModule } from './Student/student.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranscriptModule } from './Training-Transcript/transcript.module';
import { RouterModule } from '@angular/router';
import { ConfigurationModule } from './Configuration/configuration.module';
import { UnauthorizedpageComponent } from './not-found-page/unauthorizedpage/unauthorizedpage.component';
import { CatalogModule } from './Catalog/catalog.module';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    HomeComponent,
    FooterComponent,
    UserNavigationComponent,
    LoaderComponent,
    AdminNavigationComponent,
    UnauthorizedpageComponent,
    
    ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    IconModule,
    ButtonsModule,
    CardModule,
    AvatarModule,
    ChartsModule,
    HttpClientModule,
    RouterModule,
    DialogModule,
    FontAwesomeModule,
    InputsModule,
    FormsModule,
    IdpModule,
    EnrollModule,
    CatalogModule,
    TranscriptModule,
    LoginModule,
    AdmindashboardModule,
    PendingApprovalModule,
    StudentModule,
    ConfigurationModule,
    TrainingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
