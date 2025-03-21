import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar 
  ) {
    this.loginForm = this.fb.group({
      logintext: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    // alert("clicked");
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe(
        (response: any) => {
          // console.log('Login Success:', response);
          // this.showSuccessSnackbar('Login successfully.');

         localStorage.setItem('firstname', response.firstname);
        localStorage.setItem('lastname', response.lastname);
        localStorage.setItem('userRole', response.role);
        localStorage.setItem('profileImage', response.profile_image);
        localStorage.setItem('studentId', response.studentId);
        if(response.role=="Admin")
          this.router.navigate(['/IDP']);
        else
          this.router.navigate(['/studentdashboard']);
        },
        (error: any) => {
          // console.error('Login Error:', error);
          if (error.status === 401) { 
            if (error.error.message === "Your Account is archived.") {
              this.showSnackbar('Your account has been archived. Please contact support.');
            } else {
              this.showErrorSnackbar('Invalid username or password');
            }
          } else {
            this.showSnackbar('An error occurred. Please try again.');
          }
        }
      );
    } else {
      this.showSnackbar('Please enter username and password.');
    }
  }

  showSuccessSnackbar(message: string) {
    this.snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['app-notification-success']
    });
  }

  showErrorSnackbar(message: string) {
    this.snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['app-notification-error']
    });
  }

  showSnackbar(message: string) {
    this.snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['app-notification']
    });
  }
}
