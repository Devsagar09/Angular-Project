import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingComponent } from './training/training.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TrainingtypeComponent } from './trainingtype/trainingtype.component';
import { AddEditTrainingComponent } from './add-edit-training/add-edit-training.component';


@NgModule({
  declarations: [
    TrainingComponent,
    TrainingtypeComponent,
    AddEditTrainingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ]
})
export class TrainingModule { }
