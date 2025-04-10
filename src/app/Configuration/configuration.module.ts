import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './Config/configuration.component';
import { ImageCropperModule } from 'ngx-image-cropper';



@NgModule({
  declarations: [
    ConfigurationComponent
  ],
  imports: [
    CommonModule,ImageCropperModule
  ]
})
export class ConfigurationModule { }
