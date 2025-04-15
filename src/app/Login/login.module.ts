import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ForgetChangePasswordComponent } from './forget-change-password/forget-change-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    ForgetpasswordComponent,
    RegisterComponent,
    ForgetChangePasswordComponent,
    
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule 
  ]
})
export class LoginModule { }
