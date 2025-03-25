import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingApprovalComponent } from './pending-approval/pending-approval.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PendingApprovalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class PendingApprovalModule { }
