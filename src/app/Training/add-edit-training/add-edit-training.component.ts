import { Component } from '@angular/core';
import { KENDO_EDITOR } from '@progress/kendo-angular-editor';
import { StudentService } from '../../Student/student.service';
import { TrainingService } from '../training.service';
import { ActivatedRoute } from '@angular/router';

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
  // add training
  trainingTypeId: number | null = null;
  trainingData: any = {
    trainingId: '',
    trainingName: '',
    trainingCode: '',
    trainingTypeId: null,
    trainingHours: 0,
    requiresApproval: false,
    archiveDate: null,
    summary: '',
    documentFile: null,
    courseCatalog: true,
    cStartDate: null,
    cEndDate: null,
    thumbnailImage: null,
  };

  constructor(private studentService: StudentService,
              private route: ActivatedRoute,
              private trainingService: TrainingService
  ){}

  ngOnInit(): void {
    this.loadStudent();
    this.route.queryParams.subscribe((params) => {
      this.trainingTypeId = +params['trainingTypeId'] || null;
      this.trainingData.trainingTypeId = this.trainingTypeId;
    });
  }

  handleFileInput(event: any, type: 'thumbnail' | 'document'): void {
    const file = event.target.files[0];
    if (type === 'thumbnail') {
      this.trainingData.thumbnailImage = file;
    } else if (type === 'document') {
      this.trainingData.documentFile = file;
    }
  }

  saveTraining(): void {
    this.trainingService.addTraining(this.trainingData).subscribe(

      (response) => {
        console.log('Training added successfully', response);
      },
      (error) => {
        console.error('Error adding training:', error);
        if (error.status === 0) {
          console.error('Check if the API is running or there are CORS issues.');
        } else {
          console.error('Server Error:', error.message);
        }
      }
    );
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

  accordionState: any = {
    information: true,
    resources: false,
    prerequisites: false,
    courseCatalog: false,
  };

  toggleAccordion(section: string): void {
    this.accordionState[section] = !this.accordionState[section];
  }

  // document file upload
  uploadedFiles: File[] = [];

  // Trigger file input
  triggerFileUpload(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
        // Validate file format
        if (file.type === 'application/pdf') {
          this.uploadedFiles.push(file);
        } else {
          alert('Only PDF files are allowed!');
        }
      }
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
onFileUpload(event: any): void {
  const file: File = event.target.files[0];

  if (file) {
    this.selectedFile = file;
    console.log('Selected file:', file);

    // Validate file type
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedFileTypes.includes(file.type)) {
      alert('Only JPG, JPEG, and PNG files are allowed.');
      return;
    }

    // Generate preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result;
    };
    reader.readAsDataURL(file);
  }
}

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

// assign student
  studentDatas: any[]=[];

  p: number = 1;

  loadStudent(): void {
    this.studentService.getStudent().subscribe({
      next: (data) => {
        this.studentDatas = data ?? [];  // Ensures it's always an array
      },
      error: (error) => {
        console.error('Error fetching student data', error);
      },
    });
  }

   // Search training data
   searchTraining(): void {
    if (!this.searchValue.trim()) {
      this.loadStudent(); // Reload all training data if the search is empty
      return;
    }
    this.trainingService.searchTraining(this.searchValue).subscribe({
      next: (data) => {
        this.studentDatas = data ?? [];
      },
      error: (error) => {
        console.error('Error searching training data', error);
        this.studentDatas = [];
      },
    });
  }
}
