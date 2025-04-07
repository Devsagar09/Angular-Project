import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { UserNavigationService } from '../../user-navigation/user-navigation.service';
import { StudentService } from '../student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-viewprofile',
  standalone: false,
  templateUrl: './viewprofile.component.html',
  styleUrls: ['./viewprofile.component.css']
})
export class ViewprofileComponent implements OnInit {
  activeTab: string = 'user-profile';
  firstname: string | null = '';
  lastname: string | null = '';
  profileImage: string | null = '';
  imagePreview: string | null = null; // Preview of the image to be uploaded
  originalFilename: string | null = null; // Store original filename
  studentId: number = 0;
  isLoading = true;
  isLoginPage = true;
  message: string = '';
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  studentData: any = {
    student_Id: 0,
    email: null,
    phone_No: null,
    address: null,
    city: null,
    postal_Code: null,
    state: null,
    country: null
  };
  resetData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  

  constructor(private router: Router, private usernavigationService: UserNavigationService, private studentService: StudentService, private snackBar: MatSnackBar) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
      if (event instanceof NavigationEnd) {
        this.isLoginPage = this.router.url.toLowerCase() === '/login';
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    const studentId = sessionStorage.getItem('studentId');
    if (studentId) {
      this.studentId = Number(studentId);
      this.fetchProfileImage(studentId); 
      this.loadStudentData(this.studentId);
    }
  }

  loadUserData() {
    this.firstname = sessionStorage.getItem('firstname');
    this.lastname = sessionStorage.getItem('lastname');
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  loadStudentData(studentId: number): void {
    if (!studentId || studentId <= 0) {
      console.warn("Invalid student ID. Skipping API call.");
      return;
    }
  
    this.studentService.getStudentProfile(studentId).subscribe({
      next: (studentData) => {
        console.log('Student Data Fetched:', studentData);
        if (studentData) {
          this.studentData = { ...studentData };
        } else {
          console.warn('No student data found for ID:', studentId);
        }
      },
      error: (error) => {
        console.error('Error fetching student details:', error);
      }
    });
  }
  
  updateStudentProfile() {
    debugger
    const studentId = sessionStorage.getItem('studentId');
  
    if (!studentId) {
      console.error("Student ID is missing from session storage.");
      return;
    }
  
    const updatedData = {
      Student_Id: Number(studentId),
      Email: this.studentData.email,
      Phone_No: this.studentData.phoneno,
      Address: this.studentData.address,
      City: this.studentData.city,
      Postal_Code: this.studentData.postalcode,
      State: this.studentData.state,
      Country: this.studentData.country
    };
  
    this.studentService.editStudentProfile(updatedData).subscribe({
      next: (response) => {
        console.log(response.Message);
        this.showSuccessSnackbar('Profile updated successfully.');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.showErrorSnackbar('Failed to update profile.');
      }
    });
  }  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  if (!validImageTypes.includes(file.type)) {
    this.showErrorSnackbar('Only PNG, JPG or JPEG images are allowed.');
    this.originalFilename = null;
    this.imagePreview = null;
    return;
  }

      
      this.originalFilename = file.name; // Store the original filename
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Set the preview image (base64 string)
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  resetImagePreview() {
    this.imagePreview = null;
  }
  

  uploadProfileImage() {
    debugger
    if (this.imagePreview && this.imagePreview !== this.profileImage) {
        const studentId = sessionStorage.getItem('studentId');
        const parsedStudentId = Number(studentId);

        if (!this.originalFilename) {
            console.error("Original filename is missing.");
            return;
        }

        const file = this.dataURLtoFile(this.imagePreview, this.originalFilename);

        this.studentService.updateProfileImage(parsedStudentId, file, this.originalFilename).subscribe(
            response => {
                this.showSuccessSnackbar('Profile image updated.');
                setTimeout(() => {
                  location.reload(); 
              }, 1000);            
             },
            error => {
                console.error('Error updating profile image:', error);
            }
        );
    } else {
        this.showErrorSnackbar("No image selected or no change in image.");
    }
}

// Helper function to convert base64 to File
dataURLtoFile(dataurl: string, filename: string): File {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)![1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}


  fetchProfileImage(studentId: string) {
    this.usernavigationService.GetProfileImage(studentId).subscribe(
      response => {
        this.profileImage = response.profileImage;
      },
      error => {
        console.error('Error fetching profile image:', error);
      }
    );
  }


  resetPassword(form: NgForm) {
    const formData = form.value;
  
    if (formData.newPassword !== formData.confirmPassword) {
      this.message = 'New Password and Confirm Password do not match.';
      return;
    }
  
    this.studentService.checkPassword(this.studentId, formData.currentPassword).subscribe(
      (response: any) => {
        if (formData.currentPassword === formData.newPassword) {
          this.message = 'New password cannot be the same as the current password.';
          return;
        }
  
        this.studentService.resetPassword(this.studentId, formData).subscribe(
          (resetResponse: any) => {
            this.showSuccessSnackbar('Password reset successfully.');
            form.reset();
          },
          (error) => {
            console.error('API Error:', error);
            this.message = 'Password reset failed.';
          }
        );
      },
      (error) => {
        console.error('Password Check Failed:', error);
        this.message = 'Incorrect current password.';
      }
    );
  }
  
  
  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
    }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  showSuccessSnackbar(message: string) {
    // Ensure snackbar is shown only when there is a successful upload
    this.snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar-paddings']
    });
  }

  showErrorSnackbar(message: string) {
    this.snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar-paddings']
    });
  }
}