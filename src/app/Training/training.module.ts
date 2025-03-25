import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingComponent } from './training/training.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TrainingtypeComponent } from './trainingtype/trainingtype.component';



@NgModule({
  declarations: [
    TrainingComponent,
    TrainingtypeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class TrainingModule { }
