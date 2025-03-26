  import { Component, OnInit } from '@angular/core';
  import { TrainingService } from '../../Training/training.service';
import { StudentService } from '../student.service';
import { MatSnackBar } from '@angular/material/snack-bar';

  @Component({
    selector: 'app-addeditstudent',
    standalone: false,
    templateUrl: './addeditstudent.component.html',
    styleUrls: ['./addeditstudent.component.css']
  })
  export class AddeditstudentComponent implements OnInit {
    searchValue: string = '';
    noDataFound: boolean = true;;
    showField: boolean = false;
    buttonText: string = "SHOW MORE"; 
    activeTab: string = 'personInfo';
    completedTabs: string[] = [];
    trainings: any[] = [];
    filteredTrainings: any[] = []; 
    selectAll: boolean = false;
    showSelectedOnly: boolean = false;
    p: number = 1; 
    itemsPerPage: number = 10;
    itemsPerPageOptions: number[] = [2,5, 10, 20, 50];

    roles: any[] = [];
    studentData: any = { role_Id: "", student_No: "", firstname: "", lastname: "", username: "", password: "", email: "", phone_No: "" };
    
  constructor(private trainingService: TrainingService,private studentService : StudentService, private snackBar: MatSnackBar ){}
    
  ngOnInit(): void {
      this.loadTrainings();
      this.getRoles();

    }

    getRoles() {
      this.studentService.getRoles().subscribe({
        next: (data) => {
          this.roles = data;
        },
        error: (error) => {
          console.error('Error fetching roles', error);
        }
      });
    }

    loadTrainings() {
      this.trainingService.getTraining().subscribe({
        next: (data) => {
          this.trainings = data.map((training: any) => ({
            ...training,
            selected: false  // Ensure all checkboxes are initialized as unchecked
          }));
          this.updateFilteredTrainings(); // Ensure filtered data is initialized
        },
        error: (err) => {
          console.error('Error fetching training data', err);
        }
      });
    }

    searchTraining(): void {
      if (!this.searchValue.trim()) {
        this.loadTrainings(); // Reload all training data if search is empty
        this.noDataFound = false; // Reset "No data found" message
        return;
      }
    
  this.trainingService.searchTraining(this.searchValue).subscribe({
    next: (data: any[]) => {
      if (data && data.length > 0) {
        this.filteredTrainings = data; // ✅ Only store search results
        this.noDataFound = false;
      } else {
        this.filteredTrainings = []; // ✅ Empty array when no matches
        this.noDataFound = true;
      }
    },
    error: (error) => {
      console.error('Error searching training data', error);
      this.filteredTrainings = [];
      this.noDataFound = true;
    }
  });
}
    
  
  toggleSelectAll() {
    this.trainings.forEach(training => training.selected = this.selectAll);
  }

  updateSelectAll() {
    this.selectAll = this.trainings.every(training => training.selected);
  }

  toggleShowSelected() {
    this.updateFilteredTrainings();
  }

  updateFilteredTrainings() {
    if (this.showSelectedOnly) {
      this.filteredTrainings = this.trainings.filter(training => training.selected);
    } else if (!this.searchValue.trim()) { 
      this.filteredTrainings = [...this.trainings];
    }
    
    this.noDataFound = this.filteredTrainings.length === 0;
  }
  
    setActiveTab(tab: string) {
    const tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];

    // Ensure completion order (Only previous tab should be completed)
    const currentIndex = tabOrder.indexOf(this.activeTab);
    const nextIndex = tabOrder.indexOf(tab);

    if (nextIndex > currentIndex && !this.completedTabs.includes(this.activeTab)) {
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
      this.buttonText = this.showField ? "SHOW LESS" : "SHOW MORE";  // Update button text
    }

    nextStep() {
      const tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];
      const currentIndex = tabOrder.indexOf(this.activeTab);
    
      if (this.activeTab === 'personInfo') {
        this.addOrUpdateStudent(); // Insert student first
      } else if (this.activeTab === 'assignTrainings') {
        this.assignTrainings(); // Then assign training
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

    addOrUpdateStudent() {
      debugger
      this.studentService.addEditStudent(this.studentData).subscribe({
        next: (response) => {
          this.studentData.student_Id = response.StudentId;
             console.log('Student added/updated:', response);
            this.showSuccessSnackbar('Student Added Successfully.');

          this.setActiveTab('assignTrainings'); // Move to next step
        },
        error: (error) => {
          console.error('Error adding/updating student:', error);
        }
      });
    }

    assignTrainings() {
      if (!this.studentData.student_Id) {
        console.error("Student ID not found. Cannot assign trainings.");
        return;
      }
      const selectedTrainingIds = this.trainings
        .filter(training => training.selected)
        .map(training => training.training_id);
    
      if (selectedTrainingIds.length === 0) {
        console.warn("No trainings selected.");
        return;
      }
    
      const requestPayload = {
        studentId: this.studentData.student_Id,
        trainingIds: selectedTrainingIds
      };
    
      this.studentService.assignTrainings(requestPayload).subscribe({
        next: (response) => {
          console.log('Trainings assigned successfully:', response);
          this.showSuccessSnackbar('Training assigned Successfully.');

          this.setActiveTab('reviewConfirm'); // Move to review/confirm tab
        },
        error: (error) => {
          console.error('Error assigning trainings:', error);
        }
      });
    }

    showSuccessSnackbar(message: string) {
      this.snackBar.open(message, 'X', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['app-notification-success']
      });
    }
  
  }
