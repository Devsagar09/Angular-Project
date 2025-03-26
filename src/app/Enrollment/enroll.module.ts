import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollComponent } from './enroll/enroll.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EnrollComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class EnrollModule { }
