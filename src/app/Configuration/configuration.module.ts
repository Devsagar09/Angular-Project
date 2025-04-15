import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './Config/configuration.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ConfigurationComponent
  ],
  imports: [
    CommonModule,ImageCropperModule,RouterModule
  ]
})
export class ConfigurationModule { }
