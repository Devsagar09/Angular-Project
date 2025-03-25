import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplaystudentComponent } from './displaystudent/displaystudent.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { AddeditstudentComponent } from './addeditstudent/addeditstudent.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    DisplaystudentComponent,
    AddeditstudentComponent
  ],
  imports: [
    CommonModule,NgxPaginationModule,FormsModule,RouterModule
  ],
  exports: [
    RouterModule 
  ]
})
export class StudentModule { }
