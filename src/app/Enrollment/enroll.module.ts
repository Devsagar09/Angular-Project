import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollComponent } from './enroll/enroll.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    EnrollComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule
  ]
})
export class EnrollModule { }
