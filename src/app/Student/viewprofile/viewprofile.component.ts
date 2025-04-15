import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { UserNavigationService } from '../../user-navigation/user-navigation.service';
import { StudentService } from '../student.service';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';

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
  @ViewChild('imageCropperDialog') imageCropperDialog!: TemplateRef<any>;
  @ViewChild('fileInput') fileInput!: any;

imageChangedEvent: any = '';
croppedImage: string = '';
dialogRef: any;


  constructor(  private dialog: MatDialog,private router: Router, private usernavigationService: UserNavigationService, private studentService: StudentService) {
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

  onImageCropped(event: any): void {
    this.croppedImage = event.base64;
  }

  openCropperDialog(): void {
    this.dialogRef = this.dialog.open(this.imageCropperDialog, {
      width: '500px'
    });
  }

  resetCropper(): void {
    if (!this.croppedImage) {
      this.studentService.showNotification("Please upload an image first after Reset.", "warning");
      return;
    }

    this.imageChangedEvent = '';
  this.croppedImage = '';
  this.originalFilename = null;
  this.imagePreview = null;

  if (this.fileInput) {
    this.fileInput.nativeElement.value = '';
  }
  }


  closeDialog(): void {
    this.dialogRef.close();
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
        this.studentService.showNotification('Profile updated successfully.','success');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.studentService.showNotification('Failed to update profile.','error');
      }
    });
  }

  onFileInputChange(event: any): void {
    const file = event.target.files[0];
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (!file) {
      this.studentService.showNotification('Please upload an image first.', 'warning');
      return;
    }

    if (!validImageTypes.includes(file.type)) {
      this.studentService.showNotification('Only PNG, JPG or JPEG images are allowed.', 'warning');
      this.resetCropper(); // clear inputs
      return;
    }

    this.originalFilename = file.name;
    this.imageChangedEvent = event; // Pass to ngx-image-cropper

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result; // Just in case you want to preview before crop
    };
    reader.readAsDataURL(file);
  }

  uploadCroppedImage(): void {

    if (!this.croppedImage) {
      this.studentService.showNotification("Please upload an image first.", "warning");
      return;
    }

    const studentId = sessionStorage.getItem('studentId');
    const parsedStudentId = Number(studentId);

    if (!this.originalFilename) {
      this.originalFilename = `profile_${Date.now()}.png`;
    }

    const file = this.dataURLtoFile(this.croppedImage, this.originalFilename);

    this.studentService.updateProfileImage(parsedStudentId, file, this.originalFilename).subscribe(
      response => {
        this.studentService.showNotification('Profile image updated.', 'success');
        this.dialogRef.close();

        // Refresh the profile image
        setTimeout(() => {
          this.fetchProfileImage(studentId!);
          this.imageChangedEvent = '';
          this.croppedImage = '';
          this.imagePreview = null;
          window.location.reload();
        }, 600);
      },

      error => {
        console.error('Error updating profile image:', error);
        this.studentService.showNotification('Failed to upload image.', 'error');
      }
    );
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
    this.message = '';
  
    if (form.invalid) {
      // Mark all fields as touched to trigger validation
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
  
    // Password match check
    if (formData.newPassword !== formData.confirmPassword) {
      this.message = 'New Password and Confirm Password do not match.';
      return;
    }
  
    this.studentService.checkPassword(this.studentId, formData.currentPassword).subscribe(
      (response: any) => {
        // Prevent reusing old password
        if (formData.currentPassword === formData.newPassword) {
          this.message = 'New password cannot be the same as the current password.';
          return;
        }
  
        this.message = '';
  
        // Proceed to reset password
        this.studentService.resetPassword(this.studentId, formData).subscribe(
          (resetResponse: any) => {
            this.studentService.showNotification('Password reset successfully.', 'success');
            form.resetForm(); // Also resets validation states
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
}
