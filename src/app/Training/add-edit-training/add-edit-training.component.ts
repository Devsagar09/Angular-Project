import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-add-edit-training',
  standalone: false,
  templateUrl: './add-edit-training.component.html',
  styleUrl: './add-edit-training.component.css',
})
export class AddEditTrainingComponent {
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [2,5, 10, 20, 50];
  searchValue: string = '';
  showField: boolean = false;
  buttonText: string = 'SHOW MORE';
  activeTab: string = 'personInfo';
  completedTabs: string[] = [];
  studentDatas: any[] = [];
  p: number = 1;
  selectAll: boolean = false;
  showSelectedOnly: boolean = false;
  filteredStudents: any[] = [];
  noDataFound: boolean = true;;

  // add training
  trainingForm: FormGroup;
  thumbnailImage: File | null = null;
  documentFile: File | null = null ;
  trainingTypeId: number | null = null;
  trainingtype_name: string | null = null;
  uploadedFiles: File[] = [];  // document file upload
  TrainingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private trainingService: TrainingService,
    private route: ActivatedRoute
    ) {
    this.trainingForm = this.fb.group({
      trainingName: ['', Validators.required],
      trainingCode: ['', Validators.required],
      externalLinkUrl: [''],
      thumbnailImage: [''],
      documentFile: [''],
      trainingHours: [''],
      requiresApproval: [false],
      archiveDate: [''],
      summary: [''],
      courseCatalog: [''],
      cstartDate: [''],
      cendDate: [''],
    });
  }

  ngOnInit(): void {
    this.loadStudent();
    // Get the training type parameters
    this.route.queryParams.subscribe((params) => {
      console.log(params); // Debug query parameters
      this.trainingTypeId = params['trainingtype_id'];
      this.trainingtype_name = params['trainingtype_Name'];


    });
  }


  addTraining(): void {
    this.trainingForm.markAllAsTouched(); //when click on save btn so display error in require field.
    if (this.trainingForm.valid) {
      const formData = new FormData();

      // Append form values
      Object.keys(this.trainingForm.value).forEach((key) => {
        if (this.trainingForm.value[key] !== null) {
          formData.append(key, this.trainingForm.value[key]);
        }
      });

      // Append files
      if (this.thumbnailImage) {
        formData.append('ThumbnailImage', this.thumbnailImage);
      }
      if (this.documentFile) {
        formData.append('DocumentFile', this.documentFile);
      }

      // Append training type ID
      if (this.trainingTypeId) {
        formData.append('trainingtype_id', this.trainingTypeId.toString());
      }

      // Debug FormData contents
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Submit form data to the API
      this.trainingService.addTraining(formData).subscribe(
        (response) => {
         // Fetch the training ID using the exact field name from the response for assign
          this.TrainingId = response.trainingid;
          console.log('Created Training ID:', this.TrainingId);

          // Optionally, patch it into the form if necessary
          //this.trainingForm.patchValue({ training_Id: this.TrainingId });

          this.showNotification('Training added successfully','success');
          console.log(response, this.trainingForm.value);
          this.setActiveTab('assignTrainings'); // Move to next step
        },
        (error) => {
          this.showNotification('Error occurred while adding training', 'error');
          console.error(error);
        }
      );
    } else {
      console.log('Form Invalid');
    }
  }

  onFileInput(event: any, fileType: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Thumbnail file handling
      if (fileType === 'thumbnail') {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedImageTypes.includes(file.type)) {
          this.showNotification('Only JPG, JPEG, and PNG files are allowed for thumbnails.', 'warning');
          return;
        }

        this.thumbnailImage = file;

        // Generate preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrl = e.target?.result;
        };
        reader.readAsDataURL(file);

      // Document file handling
      } else if (fileType === 'document') {
        if (file.type !== 'application/pdf') {
          this.showNotification('Only PDF files are allowed for documents.', 'warning');
          return;
        }

        this.uploadedFiles.push(file);
        this.documentFile = file;

      // General file handling (e.g., uploaded files)
      } else {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedImageTypes.includes(file.type)) {
          this.selectedFile = file;

          // Generate preview URL
          const reader = new FileReader();
          reader.onload = (e) => {
            this.previewUrl = e.target?.result;
          };
          reader.readAsDataURL(file);
        } else {
          this.showNotification('Only JPG, JPEG, PNG, and PDF files are allowed.', 'warning');
        }
      }
    }
  }

  //display all student for assign
  loadStudent() {
    this.trainingService.getStudent().subscribe({
      next: (data) => {
        this.studentDatas = data.map((student: any) => ({
          ...student,
          selected: false  // Ensure all checkboxes are initialized as unchecked
        }));
        this.updateFilteredStudents();
       },
      error: (error) => {
        console.error('Error fetching student data', error);
      },
    });
  }
  // assignTrainings() {
  //   // Extract the TrainingId from the form
  //   const trainingId = this.trainingForm.get('trainingid')?.value;

  //   if (!trainingId) {
  //     console.error("Training ID not found. Cannot assign trainings.");
  //     this.showNotification("Training ID is missing. Please add or select a training.", 'error');
  //     return;
  //   }

  //   // Fetch selected student ID from a UI control or dropdown
  //   const selectedStudentId = this.selectedStudentId; // Ensure this is set from the UI
  //   if (!selectedStudentId) {
  //     console.error("Student ID not found. Cannot assign trainings.");
  //     this.showErrorSnackbar("Please select a student to assign the training.");
  //     return;
  //   }

  //   // Create payload for API call
  //   const requestPayload = {
  //     studentId: selectedStudentId,
  //     trainingId: trainingId
  //   };

  //   // Debugging the payload
  //   console.log('Request Payload:', requestPayload);

  //   // API call to assign training to the student
  //   this.trainingService.assignTraining(requestPayload).subscribe({
  //     next: (response) => {
  //       console.log('Training assigned successfully:', response);
  //       this.showSuccessSnackbar('Training assigned successfully.');
  //     },
  //     error: (error) => {
  //       console.error('Error while assigning training:', error);
  //       this.showErrorSnackbar('Failed to assign training. Please try again.');
  //     }
  //   });
  // }

  // submitForm(): void {
  //   if (this.trainingForm.valid) {
  //     const formData = new FormData();
  //     Object.keys(this.trainingForm.value).forEach((key) => {
  //       formData.append(key, this.trainingForm.value[key]);
  //     });

  //     if (this.thumbnailImage) {
  //       formData.append('ThumbnailImage', this.thumbnailImage);
  //     }
  //     if (this.documentFile) {
  //       formData.append('DocumentFile', this.documentFile);
  //     }

  //     this.trainingService.addTraining(formData).subscribe(
  //       (response) => {
  //         alert('Training Added Successfully');
  //         console.log(response);
  //       },
  //       (error) => {
  //         alert('Error occurred while adding training');
  //         console.error(error);
  //       }
  //     );
  //   } else {
  //     alert('Please fill all required fields');
  //   }
  // }

//   onFileChange(event: any, fileType: string): void {
//     const file = event.target.files[0];
//     if (fileType === 'thumbnail') {
//       this.thumbnailImage = file;
//     } else if (fileType === 'document') {
//       this.documentFile = file;
//     }
//   }

 // Handle file selection
//  onFileSelected(event: Event): void {
//   const input = event.target as HTMLInputElement;
//   if (input.files && input.files.length > 0) {
//     const file = input.files[0];
//       // Validate file format
//       if (file.type === 'application/pdf') {
//         this.uploadedFiles.push(file);
//       } else {
//         alert('Only PDF files are allowed!');
//       }
//     }
// }

// onFileUpload(event: any): void {
//   const file: File = event.target.files[0];

//   if (file) {
//     this.selectedFile = file;
//     console.log('Selected file:', file);

//     // Validate file type
//     const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//     if (!allowedFileTypes.includes(file.type)) {
//       alert('Only JPG, JPEG, and PNG files are allowed.');
//       return;
//     }

//     // Generate preview URL
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       this.previewUrl = e.target?.result;
//     };
//     reader.readAsDataURL(file);
//   }
// }

// Notifiction

 // Assign selected students to the training
 assignStudent(): void {
  console.log('Training ID:', this.TrainingId); // Confirm Training ID is available

  // Check if TrainingId exists
  // if (!this.TrainingId) {
  //   console.error('Training ID not found. Cannot assign trainings.');
  //   alert('Training ID not found. Please try again later.');
  //   return;
  // }

  // Ensure students are selected
  const selectedStudents = this.studentDatas
    .filter(student => student.selected)
    .map(student => student.student_Id)
    .join(",");

  if (!selectedStudents) {
    alert('Please select at least one student.');
    return;
  }

  // Convert selectedStudents into a properly formatted string with double quotes
  const formattedStudentIds = `"${selectedStudents}"`;

  // Prepare payload
  const payload = {
    TrainingId: this.TrainingId,
    StudentIds: formattedStudentIds // Ensure it's in double quotes
  };

  console.log('Payload for assigning students:', payload); // Log payload for debugging

  // Call API to assign students
  this.trainingService.assignStudents(payload).subscribe({
    next: (response) => {
      alert('Students successfully assigned to the training.');
      console.log('Response:', response);
    },
    error: (error) => {
      console.error('Error assigning students:', error);
      alert(`Failed to assign students. Error: ${error.message || 'Unknown error'}`);
    }
  });
}





  setActiveTab(tab: string) {
    const tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];

    // Ensure completion order (Only previous tab should be completed)
    const currentIndex = tabOrder.indexOf(this.activeTab);
    const nextIndex = tabOrder.indexOf(tab);

    if (
      nextIndex > currentIndex &&
      !this.completedTabs.includes(this.activeTab)
    ) {
      this.completedTabs.push(this.activeTab);
    }

    if (nextIndex < currentIndex) {
      // Reset completed state of tabs that come after the previous tab
      const resetTabs = tabOrder.slice(nextIndex + 1);
      resetTabs.forEach((tab) => {
        const index = this.completedTabs.indexOf(tab);
        if (index > -1) {
          this.completedTabs.splice(index, 1);
        }
      });
    }

    this.activeTab = tab;
  }
  isActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  isCompleted(tab: string): boolean {
    return this.completedTabs.includes(tab);
  }

  toggleMoreField() {
    this.showField = !this.showField;
    this.buttonText = this.showField ? 'SHOW LESS' : 'SHOW MORE'; // Update button text
  }

  // for main dropdown
  accordionState: any = {
    information: true,
    resources: false,
    prerequisites: false,
    courseCatalog: false,
  };

  toggleAccordion(section: string): void {
    this.accordionState[section] = !this.accordionState[section];
  }


  // Trigger file input
  triggerFileUpload(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }


  // Delete file
  deleteFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null | undefined = null;

/**
 * Triggered when a file is selected.
 */


/**
 * Clears the selected file and preview.
 */
clearFile(): void {
  this.selectedFile = null;
  this.previewUrl = null;
}

/**
 * Triggered when the upload button is clicked.
 */
triggerFileInput(fileInput: HTMLInputElement): void {
  fileInput.click();
}


// search student
searchStudent(): void {
  const trimmedValue = this.searchValue.trim();
  if (!trimmedValue) {
    this.filteredStudents = [...this.studentDatas];
    this.noDataFound = false;
    return;
  }

  this.filteredStudents = this.studentDatas.filter((student) =>
    `${student.firstname} ${student.lastname}`
      .toLowerCase()
      .includes(trimmedValue.toLowerCase())
  );

  this.noDataFound = this.filteredStudents.length === 0;
}

// notification
showNotification(
  message: string,
  type: 'success' | 'warning' | 'error' = 'error'
): void {
  // Ensure the container exists or create it
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '1000';
    document.body.appendChild(container);
  }

  // Remove existing notification if any
  const existingNotification = document.getElementById('current-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create a new notification element
  const notification = document.createElement('div');
  notification.id = 'current-notification'; // Set unique ID for the notification
  notification.style.backgroundColor =
    type === 'success'
      ? '#4caf50'
      : type === 'warning'
      ? '#ff9800'
      : '#f44336'; // Set color based on type
  notification.style.color = 'white';
  notification.style.padding = '15px 20px';
  notification.style.marginBottom = '10px';
  notification.style.borderRadius = '8px';
  notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.justifyContent = 'space-between';
  notification.style.fontSize = '14px';

  // Set message and close button
  notification.innerHTML = `
    <span>${message}</span>
    <button style="
      background: transparent;
      border: none;
      color: white;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
    ">&times;</button>
  `;

  // Add close button functionality
  const closeButton = notification.querySelector('button') as HTMLButtonElement;
  closeButton.onclick = () => notification.remove();

  // Append the new notification to the container
  container.appendChild(notification);

  // Automatically remove the notification after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}


//add training button function
nextStep() {
  const tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];
  const currentIndex = tabOrder.indexOf(this.activeTab);

  if (this.activeTab === 'personInfo') {
    this.addTraining(); // Insert student first
  } else if (this.activeTab === 'assignTrainings') {
    //this.assignStudent(); // Then assign training
  } else if (currentIndex < tabOrder.length - 1) {
    this.setActiveTab(tabOrder[currentIndex + 1]);
  }
}

// ✅ Move to the previous tab
prevStep() {
  const tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];
  const currentIndex = tabOrder.indexOf(this.activeTab);

  if (currentIndex > 0) {
    this.setActiveTab(tabOrder[currentIndex - 1]);
  }
}

saveAndExit(){

}

saveReview(){

}

readyToFinish(){

}

// checkbox select
toggleSelectAll() {
  this.studentDatas.forEach(student => student.selected = this.selectAll);
}

updateSelectAll() {
  this.selectAll = this.studentDatas.every(student => student.selected);
}

toggleShowSelected() {
  this.updateFilteredStudents();
}

updateFilteredStudents() {
  if (this.showSelectedOnly) {
    this.filteredStudents = this.studentDatas.filter(student => student.selected);
  } else if (!this.searchValue.trim()) {
    this.filteredStudents = [...this.studentDatas];
  }

  this.noDataFound = this.filteredStudents.length === 0;
}

}
