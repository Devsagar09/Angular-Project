import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './Config/configuration.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImageCropperModule } from 'ngx-image-cropper';



@NgModule({
  declarations: [
    ConfigurationComponent
  ],
  imports: [
    CommonModule,MatSnackBarModule,ImageCropperModule
  ]
})
export class ConfigurationModule { }
