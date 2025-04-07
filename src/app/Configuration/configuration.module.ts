import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './Config/configuration.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    ConfigurationComponent
  ],
  imports: [
    CommonModule,MatSnackBarModule
  ]
})
export class ConfigurationModule { }
