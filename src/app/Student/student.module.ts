import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplaystudentComponent } from './displaystudent/displaystudent.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DisplaystudentComponent
  ],
  imports: [
    CommonModule,NgxPaginationModule,FormsModule
  ]
})
export class StudentModule { }
