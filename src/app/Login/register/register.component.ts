import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { AdminNavigationComponent } from '../../admin-navigation/admin-navigation.component';
import { AdminNavigationService } from '../../admin-navigation/admin-navigation.service';
import { LoginService } from '../login.service';
import { StudentService } from '../../Student/student.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  showPassword = false;
  errorMessage: string = '';
  loading: boolean = false;
  companyimage :string | null = '';
  studentData: any = {
    student_Id: 0,
    student_No: null,
    firstname: null,
    middlename: null,
    lastname: null,
    username: null,
    password: null,
    email: null,
    role_Id: null,
    profile_Image: null,
    archive_Date: null,
    phone_No: null,
    address: null,
    city: null,
    postal_Code: null,
    state: null,
    country: null
  };

  constructor(private fb: FormBuilder,
    private adminnavigationService:AdminNavigationService,
     private loginService:LoginService,
  private studentService:StudentService) {}

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

  generateUsernameAndPassword() {
    if (this.studentData.firstname && this.studentData.lastname) {
      const baseUsername = this.studentData.firstname.charAt(0) + this.studentData.lastname;
      this.ensureUniqueUsername(baseUsername);
    }
  }

  ensureUniqueUsername(baseUsername: string) {
    let newUsername = baseUsername;
    let existingCount = 0;

    this.studentService.getStudent().subscribe({
      next: (students) => {
        while (students.some((student: { username: string; }) => student.username === newUsername)) {
          existingCount++;
          newUsername = baseUsername + existingCount;
        }

        this.studentData.username = newUsername;
      },
      error: (err: any) => {
        console.error('Error fetching students:', err);
      }
    });
  }


  onRegister(studentForm: NgForm) {
    if (studentForm.invalid) {
      Object.values(studentForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return; // stop here if form is invalid
    }
  
    this.studentService.getStudent().subscribe({
      next: (students: any[]) => {
        const emailExists = students.some(s => s.email === this.studentData.email);
        const usernameExists = students.some(s => s.username === this.studentData.username);
  
        if (emailExists || usernameExists) {
          const duplicateFields = [
            emailExists ? 'Email' : '',
            usernameExists ? 'Username' : ''
          ].filter(f => f).join(' and ');
  
          this.loginService.showNotification(`${duplicateFields} already exists.`,'warning');
          return;
        }
  
        // Proceed to register if not duplicate
        this.loginService.selfRegister(this.studentData).subscribe({
          next: () => {
            this.loginService.showNotification("Student Registered.",'success');
            studentForm.resetForm();
            setTimeout(() => {
              window.location.href='/login';
            }, 1000);
          },
          error: (error) => {
            console.error("API Error (Add):", error);
            this.loginService.showNotification('Failed to register.','error');
          }
        });
      },
      error: (err) => {
        console.error('Error fetching students:', err);
        this.loginService.showNotification('Failed to validate user.','error');
      }
    });
  }
    }


