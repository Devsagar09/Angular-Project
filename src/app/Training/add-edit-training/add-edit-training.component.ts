import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainingService } from '../training.service';
import { ConfigurationService } from '../../Configuration/configuration.service';

@Component({
  selector: 'app-add-edit-training',
  standalone: false,
  templateUrl: './add-edit-training.component.html',
  styleUrl: './add-edit-training.component.css',
})
export class AddEditTrainingComponent {
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [2, 5, 10, 20, 50];
  isLoading = false;
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
  noDataFound: boolean = true;
  trainingId: any;

  // add training
  trainingForm: FormGroup;
  thumbnailImage: File | null = null;
  documentFile: File | null = null;
  trainingTypeId: number | null = null;
  trainingtype_name: string | null = null;
  uploadedFiles: File[] = []; // document file upload
  // TrainingId: number | null = null;
  latestTraining: any = {};

  configData: any[] = []; // Store API response

  constructor(
    private fb: FormBuilder,
    private trainingService: TrainingService,
    private route: ActivatedRoute,
    private configService: ConfigurationService
  ) {
    this.trainingForm = this.fb.group({
      trainingName: ['', Validators.required],
      trainingCode: ['', Validators.required],
      externalLinkUrl: [''],
      thumbnailImage: [''],
      documentFile: [''],
      trainingHours: [''],
      requiresApproval: [''],
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

    // Fetch Configurations (Assuming TrainingService fetches it)
    this.configService.getConfig().subscribe((data) => {
      this.configData = data;

      //this code for set config value in add training cc and requireapproval
      // Find specific config values and set them in the form
      const requiresApprovalConfig = this.configData.find(config => config.config_key === 'Requires Approval');
      const courseCatalogConfig = this.configData.find(config => config.config_key === 'Course Catalog');

      // Set the form values
      this.trainingForm.patchValue({
        requiresApproval: requiresApprovalConfig ? requiresApprovalConfig.config_value : false,
        courseCatalog: courseCatalogConfig ? courseCatalogConfig.config_value : false
      });
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
          // this.trainingForm = { ...this.trainingForm, Training_Id: response.TrainingId}
          // ✅ Correctly extract training ID (Check exact field name)

          // Ensure TrainingId is properly extracted
          if (response && response.trainingId) {
            this.trainingId = response.trainingId; // Ensure this assignment is correct
          }

          //this.TrainingId = Number(response.TrainingId);

          // Optionally, patch it into the form if necessary
          //this.trainingForm.patchValue({ training_Id: this.TrainingId });

          this.trainingService.showNotification('Training added successfully', 'success');
          console.log(response, this.trainingForm.value);
          this.setActiveTab('assignTrainings'); // Move to next step
        },
        (error) => {
          this.trainingService.showNotification(
            'Error occurred while adding training',
            'error'
          );
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
          this.trainingService.showNotification(
            'Only JPG, JPEG, and PNG files are allowed for thumbnails.',
            'warning'
          );
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
          this.trainingService.showNotification(
            'Only PDF files are allowed for documents.',
            'warning'
          );
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
          this.trainingService.showNotification(
            'Only JPG, JPEG, PNG, and PDF files are allowed.',
            'warning'
          );
        }
      }
    }
  }

  //display all student for assign
  loadStudent() {
    this.isLoading = true;

    this.trainingService.getStudent().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.studentDatas = data.map((student: any) => ({
            ...student,
            selected: false, // Ensure all checkboxes are initialized as unchecked
          }));

          this.updateFilteredStudents();
          this.isLoading = false;
        }, 300);
      },
      error: (error) => {
        console.error('Error fetching student data', error);
        this.isLoading = false; // Stop loader on error too
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


  // Assign selected students to the training
  assignStudents(): void {
    // Fetch TrainingId from sessionStorage and convert it to a number
    // const trainingIdFromSession = sessionStorage.getItem("TrainingId");
    // this.trainingId = trainingIdFromSession ? Number(trainingIdFromSession) : this.trainingId;

    console.log('Training ID:', this.trainingId); // Confirm Training ID is available

    // if (!this.TrainingId) {
    //   console.error('Training ID not found. Cannot assign trainings.');
    //   alert('Training ID not found. Please try again.');
    //   return;
    // }

    // Ensure students are selected
    const selectedStudents = this.studentDatas
      .filter((student) => {
        return student.selected && student.student_Id;
      })
      .map((student) => student.student_Id)
      .join(',');

    if (!selectedStudents) {
      this.trainingService.showNotification('Please select at least one student.', 'warning');
      return;
    }

    // Construct payload
    const payload = {
      TrainingId: this.trainingId,
      StudentIds: selectedStudents,
    };

    console.log('Payload for assigning students:', payload);

    // Call API
    this.trainingService.assignStudents(payload).subscribe(
      (response) => {
        console.log('Response:', response);
        this.trainingService.showNotification(
          'Successfully assigned Training to Students.',
          'success'
        );
        this.setActiveTab('reviewConfirm');
      },
      (error) => {
        console.error('API Error:', error);
        this.trainingService.showNotification(
          'Failed to assign Training to Students.',
          'error'
        );
        //this.setActiveTab('reviewConfirm');
      }
    );
  }

  getTrainingDetails(): void {
    if (!this.trainingId) {
      console.log('No Training ID available.');
      return;
    }

    this.trainingService.getTrainingById(this.trainingId).subscribe(
      (response) => {
        if (response) {
          console.log('Training Details:', response);

          // Populate the form with retrieved data
          this.trainingForm.patchValue({
            trainingName: response.trainingName,
            trainingCode: response.trainingCode,
            externalLinkUrl: response.externalLinkUrl,
            trainingHours: response.trainingHours,
            requiresApproval: response.requiresApproval,
            archiveDate: response.archiveDate,
            summary: response.summary,
            courseCatalog: response.courseCatalog,
            cstartDate: response.cstartDate,
            cendDate: response.cendDate,
          });

          // // Handle file URLs if needed (Thumbnail & Document)
          // this.thumbnailImageUrl = response.thumbnailImageUrl;
          // this.documentFileUrl = response.documentFileUrl;
        }
      },
      (error) => {
        console.error('Error fetching training details:', error);
      }
    );
  }


  // assignStudents(): void {
  //   debugger;
  //   console.log('Training ID:', this.trainingId);

  //   const selectedStudents = this.studentDatas
  //     .filter(student => student.selected && student.student_Id)
  //     .map(student => student.student_Id)
  //     .join(',');

  //   if (!selectedStudents) {
  //     alert('Please select at least one student.');
  //     return;
  //   }

  //   const payload = { TrainingId: this.trainingId, StudentIds: selectedStudents };
  //   console.log('Payload:', payload);

  //   this.trainingService.assignStudents(payload).subscribe({
  //     next: response => this.showNotification('Students assigned successfully.', 'success'),
  //     error: error => this.showNotification('Failed to assign training.', 'error')
  //   });
  // }

  tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];

  setActiveTab(tab: string) {

    // Ensure completion order (Only previous tab should be completed)
    const currentIndex = this.tabOrder.indexOf(this.activeTab);
    const nextIndex = this.tabOrder.indexOf(tab);

    if (
      nextIndex > currentIndex &&
      !this.completedTabs.includes(this.activeTab)
    ) {
      this.completedTabs.push(this.activeTab);
    }

    if (nextIndex < currentIndex) {
      // Reset completed state of tabs that come after the previous tab
      const resetTabs = this.tabOrder.slice(nextIndex + 1);
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

  // Prevent(stop) jumping to tab unless previous tab is completed
  //not redirect to another tab when not complete current tab
  canActivateTab(tab: string): boolean {
    const tabIndex = this.tabOrder.indexOf(tab);
    if (tabIndex === 0) return true;

    const previousTab = this.tabOrder[tabIndex - 1];
    return this.isCompleted(previousTab);
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
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLElement;
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
    const trimmedValue = this.searchValue.trim().toLowerCase();

    let baseList = [...this.studentDatas];

    if (this.showSelectedOnly) {
      baseList = baseList.filter(student => student.selected);
    }

    if (!trimmedValue) {
      this.filteredStudents = [...baseList];
      this.noDataFound = this.filteredStudents.length === 0;
      return;
    }

    this.filteredStudents = baseList.filter(student => {
      const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
      const studentNo = student.student_No?.toLowerCase() || '';
      const archiveDate = student.archive_Date?.toLowerCase() || '';

      return (
        fullName.includes(trimmedValue) ||
        studentNo.includes(trimmedValue) ||
        archiveDate.includes(trimmedValue)
      );
    });

    this.noDataFound = this.filteredStudents.length === 0;
  }



  //add training button function
  savenextStep() {
    const tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];
    const currentIndex = tabOrder.indexOf(this.activeTab);

    if (this.activeTab === 'personInfo') {
      // this.trainingService.showNotification("Please fill all required fields.", 'error');
      this.addTraining(); // Insert Training first
    } else if (this.activeTab === 'assignTrainings') {
      this.assignStudents(); // Then assign Student
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

  next() {
    this.setActiveTab('reviewConfirm');
  }

  saveAndExit() {
    window.location.href = '/training'; // Redirect to another page
  }


  // checkbox select
  toggleSelectAll() {
    this.studentDatas.forEach((student) => (student.selected = this.selectAll));
  }

  updateSelectAll() {
    this.selectAll = this.studentDatas.every((student) => student.selected);
  }

  toggleShowSelected() {
    this.updateFilteredStudents();
  }
  
  updateFilteredStudents() {
    this.isLoading = true;

    setTimeout(() => {
      const trimmedSearch = this.searchValue.trim().toLowerCase();

      let baseList = this.showSelectedOnly
        ? this.studentDatas.filter((student) => student.selected)
        : [...this.studentDatas];

      if (!trimmedSearch) {
        this.filteredStudents = baseList;
      } else {
        this.filteredStudents = baseList.filter((student) => {
          const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
          const studentNo = student.student_No?.toLowerCase() || '';
          const archiveDate = student.archive_Date
            ? new Date(student.archive_Date).toLocaleDateString().toLowerCase()
            : '';

          return (
            fullName.includes(trimmedSearch) ||
            studentNo.includes(trimmedSearch) ||
            archiveDate.includes(trimmedSearch)
          );
        });
      }

      this.noDataFound = this.filteredStudents.length === 0;
      this.isLoading = false;
    }, 300);
  }



}
