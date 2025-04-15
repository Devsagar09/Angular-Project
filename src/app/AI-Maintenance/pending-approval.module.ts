import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingApprovalComponent } from './pending-approval/pending-approval.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { DisplayStatusComponent } from './display-status/display-status.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    PendingApprovalComponent,
    DisplayStatusComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule
  ]
})
export class PendingApprovalModule { }
