import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  showPassword: boolean = false;


  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    // alert("clicked");
    if (this.loginForm.valid) {
      this.loading = true;
      this.loginService.login(this.loginForm.value).subscribe(
        (response: any) => {
          // console.log('Login Success:', response);
          // this.loginService.showNotification('Login successfully.','success');
          
          sessionStorage.setItem('firstname', response.firstname);
          sessionStorage.setItem('lastname', response.lastname);
          sessionStorage.setItem('userRole', response.role);
          sessionStorage.setItem('studentId', response.studentId);
          
          setTimeout(() => {
            this.router.navigate([response.role === 'Admin' ? '/dashboard' : '/studentdashboard']).then(() => {
              window.location.reload(); // Reload after a small delay
          }); 
          }, 300); 
      },

        (error: any) => {
          this.loading = false;
          // console.error('Login Error:', error);
          if (error.status === 401) { 
            if (error.error.message === "Your Account is archived.") {
              this.loginService.showNotification('Your account has been archived. Please contact support.','warning');
            } else {
              this.loginService.showNotification('Invalid username or password','error');
            }
          } else {
            this.loginService.showNotification('An error occurred. Please try again.','error');
          }
        }
      );
    } else {
      this.loginService.showNotification('Please enter username and password.','error');
    }
  }
}
