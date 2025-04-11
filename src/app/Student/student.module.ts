import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplaystudentComponent } from './displaystudent/displaystudent.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { AddeditstudentComponent } from './addeditstudent/addeditstudent.component';
import { RouterModule } from '@angular/router';
import { ViewprofileComponent } from './viewprofile/viewprofile.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    DisplaystudentComponent,
    AddeditstudentComponent,
    ViewprofileComponent
  ],
  imports: [
    CommonModule,NgxPaginationModule,FormsModule,RouterModule , 
    MatDialogModule,
    MatButtonModule,
    ImageCropperModule
  
  ],
  exports: [
    RouterModule
  ]
})
export class StudentModule { }
