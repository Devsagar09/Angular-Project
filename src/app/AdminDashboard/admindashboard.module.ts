import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AdmindashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class AdmindashboardModule { }
