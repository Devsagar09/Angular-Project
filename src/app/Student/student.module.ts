import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplaystudentComponent } from './displaystudent/displaystudent.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { AddeditstudentComponent } from './addeditstudent/addeditstudent.component';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    DisplaystudentComponent,
    AddeditstudentComponent
  ],
  imports: [
    CommonModule,NgxPaginationModule,FormsModule,RouterModule, MatSnackBarModule,
  ],
  exports: [
    RouterModule 
  ]
})
export class StudentModule { }
