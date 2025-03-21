import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms'; 


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ]
})
export class LoginModule { }
