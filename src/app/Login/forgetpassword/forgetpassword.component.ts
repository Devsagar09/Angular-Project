import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgetpassword',
  standalone: false,
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.css'
})
export class ForgetpasswordComponent {
  forgetPasswordForm: FormGroup;
  showPasswordFields = false;
  message = '';
  showNewPassword = false;
showConfirmPassword = false;


  constructor(private fb: FormBuilder, private loginService: LoginService, private snackBar:MatSnackBar) {
    this.forgetPasswordForm = this.fb.group({
      UsernameAndEmail: this.fb.control({ value: '', disabled: false }, [Validators.required, Validators.email]),
      New_Password: ['', [Validators.required]],
      Confirm_Password: ['', [Validators.required]],
    });
  }

  toggleVisibility(field: 'new' | 'confirm') {
    if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  checkUserExists() {
    const emailOrUsername = this.forgetPasswordForm.getRawValue().UsernameAndEmail;

    if (!emailOrUsername?.trim()) {
      this.message = 'Username or Email is required.';
      return;
    }

    this.loginService.checkUserExists(emailOrUsername).subscribe({
      next: () => {
        this.message = ''; 
        this.showPasswordFields = true;
        this.forgetPasswordForm.get('UsernameAndEmail')?.disable();
      },
      error: (err) => {
        this.message = err.error?.message;
        this.showPasswordFields = false;
        this.forgetPasswordForm.get('UsernameAndEmail')?.enable();
      },
    });
  }

  forgetPassword() {
    const form = this.forgetPasswordForm.value;

    if (form.New_Password !== form.Confirm_Password) {
      this.message = "Passwords do not match.";
      return;
    }
    this.message = ''; 

    const resetData = {
      UsernameAndEmail: this.forgetPasswordForm.getRawValue().UsernameAndEmail,
      New_Password: form.New_Password,
      Confirm_Password: form.Confirm_Password,
    };

    this.loginService.forgetPassword(resetData).subscribe({
      next: (res) => {
        this.snackBar.open('Password reset successfully.', 'X', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.showPasswordFields = false;
        this.forgetPasswordForm.reset();
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);      },
      error: (err) => {
        this.message = err.error?.message || "Password reset failed.";
      },
    });
  }
}
