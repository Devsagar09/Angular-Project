import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../training.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-training',
  standalone: false,
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.css']
})
export class EditTrainingComponent implements OnInit {
  trainingForm!: FormGroup;
  uploadedFiles: { file?: File, preview?: SafeUrl, name: string }[] = [];
  trainingtype_Id: number | null = null;
  studentDatas: any[] = [];
  trainingId: any;

  // uploadedFiles: File[] = []; // document file upload
  activeTab: string = 'personInfo';
  completedTabs: string[] = [];
  p: number = 1;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [2, 5, 10, 20, 50];
  searchValue: string = '';
  selectAll: boolean = false;
  showSelectedOnly: boolean = false;
  filteredStudents: any[] = [];
  noDataFound: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private trainingService: TrainingService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.showSelectedOnly = true; // 👈 Default filter ON

    this.trainingForm = this.fb.group({
      trainingId: [''],
      trainingName: [''],
      trainingCode: [''],
      trainingtype_Id: [''],
      trainingTypeName: [''],
      documentFile: [''],
      externalLinkUrl: [''],
      trainingHours: [''],
      requiresApproval: [''],
      archiveDate: [''],
      summary: [''],
      courseCatalog: [''],
      cstartDate: [''],
      cendDate: [''],
      thumbnailImage: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.trainingId = parseInt(id, 10);
      this.loadTrainingDetails(this.trainingId);
      this.loadStudentWithAssigned(this.trainingId); // for display assign students
    }
    //fetch all students
    // this.loadStudent()
  }



  loadTrainingDetails(id: number) {
    this.trainingService.getTrainingByIds(id).subscribe(data => {
      // Convert date format to "yyyy-MM-dd"
      if (data.cstartDate) {
        data.cstartDate = this.formatDate(data.cstartDate);
      }
      if (data.cendDate) {
        data.cendDate = this.formatDate(data.cendDate);
      }
      if (data.archiveDate) {
        data.archiveDate = this.formatDate(data.archiveDate);
      }
      // Show file name in uploadedFiles table
      if (data.documentFile) {
        this.uploadedFiles.push({ name: data.documentFile });
      }

      if (data.thumbnailImage) {
        this.thumbnailPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(`https://localhost:7172/uploads/${data.thumbnailImage}`);
      }

      // ✅ SET the trainingId here for assign
      this.trainingId = data.trainingId;

      this.trainingForm.patchValue(data);
    });
  }

  // Function to format date to "yyyy-MM-dd"
  formatDate(dateString: string): string {
    return dateString ? dateString.split('T')[0] : '';
  }

  //for display assign student
  loadStudentWithAssigned(trainingId: number): void {
    this.trainingService.getStudent().subscribe({
      next: (allStudents) => {
        // Step 1: Prepare all student list
        this.studentDatas = allStudents.map((student: any) => ({
          ...student,
          selected: false
        }));

        // Step 2: Now fetch assigned student IDs
        this.trainingService.getAssignedStudentIds(trainingId).subscribe({
          next: (assignedIds: number[]) => {
            this.studentDatas.forEach((student) => {
              if (assignedIds.includes(student.student_Id)) {
                student.selected = true;
              }
            });

            // Update UI
            this.updateFilteredStudents();
            this.updateSelectAll(); // Reflect checkbox UI
          },
          error: (err) => {
            console.error('Failed to fetch assigned student IDs', err);
          }
        });
      },
      error: (err) => {
        console.error('Failed to load students', err);
      }
    });
  }

  //for UI is active

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
   * Clears the selected file and preview.
   */
  // clearFile(): void {
  //   this.selectedFile = null;
  //   this.previewUrl = null;
  // }

  /**
  * Triggered when the upload button is clicked.
  */
  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  //add training button function
  savenextStep() {
    const tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];
    const currentIndex = tabOrder.indexOf(this.activeTab);

    if (this.activeTab === 'personInfo') {
      this.trainingService.showNotification("Please fill all required fields.", 'error');
      this.updateTraining();
      // this.loadTrainingDetails(); // Insert Training first
    } else if (this.activeTab === 'assignTrainings') {
      this.updateassignStudents(); // Then assign Student
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

  // show document file

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedFiles = [{
          name: file.name,
          file: file,
          preview: reader.result as SafeUrl
        }];
      };
      reader.readAsDataURL(file);
    }
  }

  //for show selected cc image
  selectedThumbnailFile: File | null = null;
  thumbnailPreviewUrl: SafeUrl | null = null;

  // When file is selected via file input
  onThumbnailSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedThumbnailFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnailPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Clear the selected thumbnail file
  clearFile(): void {
    this.selectedThumbnailFile = null;
    this.thumbnailPreviewUrl = null;
  }


  // Inside EditTraining
  updateTraining(): void {
    const formData = new FormData();

    // Append non-file fields
    Object.entries(this.trainingForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    });

    // Append document file if selected
    if (this.uploadedFiles.length > 0 && this.uploadedFiles[0].file) {
      formData.append('DocumentFile', this.uploadedFiles[0].file);
    }

    // Append thumbnail image if selected
    if (this.selectedThumbnailFile) {
      formData.append('ThumbnailImage', this.selectedThumbnailFile);
    }

    // Append training type ID
    if (this.trainingtype_Id) {
      formData.append('Trainingtype_Id', this.trainingtype_Id.toString());
    }

    // Make API call
    this.trainingService.updateTraining(formData).subscribe({
      next: (response: any) => {
        console.log('Training updated successfully:', response);
        this.trainingService.showNotification('Training updated successfully :)', 'success');
        this.setActiveTab('assignTrainings'); // Redirect
      },
      error: (error) => {
        console.error('Error updating training:', error);
        this.trainingService.showNotification('Failed to update training.', 'error');
      }
    });
  }

  //for assign training to student
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


  //display all student for assign
  // loadStudent() {
  //   this.trainingService.getStudent().subscribe({
  //     next: (data) => {
  //       this.studentDatas = data.map((student: any) => ({
  //         ...student,
  //         selected: false, // Ensure all checkboxes are initialized as unchecked
  //       }));
  //       this.updateFilteredStudents();
  //     },
  //     error: (error) => {
  //       console.error('Error fetching student data', error);
  //     },
  //   });
  // }

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
    if (this.showSelectedOnly) {
      this.filteredStudents = this.studentDatas.filter(
        (student) => student.selected
      );
    } else if (!this.searchValue.trim()) {
      this.filteredStudents = [...this.studentDatas];
    }

    this.noDataFound = this.filteredStudents.length === 0;
  }

  //assign student
  updateassignStudents(): void {
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

    // if (!selectedStudents) {
    //   this.showNotification('Please select at least one student.','warning');
    //   return;
    // }

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
}
