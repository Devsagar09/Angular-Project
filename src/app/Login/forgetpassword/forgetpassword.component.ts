import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgetpassword',
  standalone: false,
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.css'
})
export class ForgetpasswordComponent {
  forgetPasswordForm: FormGroup;
  message = '';
  loading = false;
  success = false;

  constructor(private fb: FormBuilder, private loginService: LoginService) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  
    // Clear message when email input changes
    this.forgetPasswordForm.get('email')?.valueChanges.subscribe(() => {
      this.message = '';
      this.success = false;
    });
  }

  sendResetLink() {
    debugger
    if (this.forgetPasswordForm.invalid) {
      this.forgetPasswordForm.markAllAsTouched(); 
      return;
    }
    const email = this.forgetPasswordForm.get('email')?.value?.trim().toLowerCase();
  
    if (!email) {
      this.message = 'Email is required.';
      this.success = false;
      this.loading = false;
      return;
    }
  
    this.loading = true;
    this.success = false;
    this.message = 'Sending...';
  
    this.loginService.sendResetEmail(email).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.message = 'Reset link has been sent to your email.';
        this.loginService.showNotification('Reset link has been sent to your eMail.', 'success');
        this.forgetPasswordForm.reset();
      },
      error: (err) => {
        this.loading = false;
        this.success = false;
  
        if (err.status === 400) {
          this.message = 'Email is required.';
        } else if (err.status === 404) {
          this.message = 'This email is not Registered.';
        } else {
          this.message = 'An error occurred. Please try again.';
        }
      }
    });
  }
  
}
