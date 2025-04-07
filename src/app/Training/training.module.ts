import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingComponent } from './training/training.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TrainingtypeComponent } from './trainingtype/trainingtype.component';
import { AddEditTrainingComponent } from './add-edit-training/add-edit-training.component';
import { EditTrainingComponent } from './edit-training/edit-training.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    TrainingComponent,
    TrainingtypeComponent,
    AddEditTrainingComponent,
    EditTrainingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class TrainingModule { }
