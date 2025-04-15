import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-forget-change-password',
  standalone: false,
  templateUrl: './forget-change-password.component.html',
  styleUrl: './forget-change-password.component.css'
})
export class ForgetChangePasswordComponent {
  resetForm!: FormGroup;
  emailFromLink: string = '';
  message: string = '';
  error: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loginService:LoginService
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      email: [{ value: '', disabled: true }, Validators.required],
      new_password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    });

    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      if (email) {
        this.emailFromLink = email;
        this.resetForm.patchValue({ email });
      }
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) return;

    const formValue = this.resetForm.getRawValue();

    if (formValue.new_password !== formValue.confirm_password) {
      this.error = 'Passwords do not match.';
      this.message = '';
      return;
    }

    const payload = {
      email: formValue.email,
      new_password: formValue.new_password,
      confirm_password: formValue.confirm_password
    };

    this.loginService.resetPassword(payload).subscribe({
      next: (res: any) => {
        this.loginService.showNotification('Password Changed Successfully','success');
        this.error = '';
      },
      error: (err) => {
        this.message = '';
        this.error = err.error.message || 'Something went wrong.';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}