import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { AdminNavigationComponent } from '../../admin-navigation/admin-navigation.component';
import { AdminNavigationService } from '../../admin-navigation/admin-navigation.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  companyimage :string | null = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar ,
    private adminnavigationService:AdminNavigationService
  ) {
    this.loginForm = this.fb.group({
      logintext: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.displayLogo();
  }
  
  displayLogo() {
    this.adminnavigationService.displayLogo().subscribe(
      (response: any) => {
        this.companyimage = response.companylogo; 
      },
      error => {
        console.error('Error fetching company logo:', error);
      }
    );
  }

  onLogin() {
    // alert("clicked");
    if (this.loginForm.valid) {
      this.loading = true;
      this.loginService.login(this.loginForm.value).subscribe(
        (response: any) => {
          // console.log('Login Success:', response);
          // this.showSuccessSnackbar('Login successfully.');
          
          sessionStorage.setItem('firstname', response.firstname);
          sessionStorage.setItem('lastname', response.lastname);
          sessionStorage.setItem('userRole', response.role);
          sessionStorage.setItem('studentId', response.studentId);
          
         this.router.navigate([response.role === 'Admin' ? '/dashboard' : '/studentdashboard']).then(() => {
            this.loading=true;
            window.location.reload(); // Reload after a small delay
        });
        
      },

        (error: any) => {
          this.loading = false;
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
