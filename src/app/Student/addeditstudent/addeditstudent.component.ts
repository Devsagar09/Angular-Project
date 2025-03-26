  import { Component, OnInit } from '@angular/core';
  import { TrainingService } from '../../Training/training.service';
import { StudentService } from '../student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

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
    showPassword: boolean = false;

    roles: any[] = [];
    studentData: any = { role_Id: "",username: "", password: "", };
    
  constructor(private trainingService: TrainingService,private studentService : StudentService, private snackBar: MatSnackBar ){}
    
  ngOnInit(): void {
      this.loadTrainings();
      this.getRoles();  
    }

    generateUsernameAndPassword() {
      if (this.studentData.firstname && this.studentData.lastname) {

        const baseUsername = this.studentData.firstname.charAt(0).toLowerCase() + this.studentData.lastname.toLowerCase();
  
        this.studentData.username = baseUsername;
        
        this.studentData.password = baseUsername;
  
        console.log("Generated Username:", this.studentData.username);
        console.log("Generated Password:", this.studentData.password);
      }
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
        this.filteredTrainings = data; 
        this.noDataFound = false;
      } else {
        this.filteredTrainings = []; 
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
    

  updateFilteredTrainings() {
    if (this.showSelectedOnly) {
      this.filteredTrainings = this.trainings.filter(training => training.selected);
    } else if (!this.searchValue.trim()) { 
      this.filteredTrainings = [...this.trainings];
    }
    
    this.noDataFound = this.filteredTrainings.length === 0;
  }
  
    setActiveTab(tab: string) {
      console.log(`Switching to tab: ${tab}, Student ID: ${this.studentData.student_Id}`);

    const tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];

    const currentIndex = tabOrder.indexOf(this.activeTab);
    const nextIndex = tabOrder.indexOf(tab);

    if (nextIndex > currentIndex && !this.completedTabs.includes(this.activeTab)) {
      this.completedTabs.push(this.activeTab);
    }

    if (nextIndex < currentIndex) {
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
      this.buttonText = this.showField ? "SHOW LESS" : "SHOW MORE";  
    }

    nextStep() {
      const tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];

      const currentIndex = tabOrder.indexOf(this.activeTab);
    
      if (this.activeTab === 'personInfo') {
        this.addOrUpdateStudent(); 
      } else if (this.activeTab === 'assignTrainings') {
        this.assignTrainings(); 
      } else if (currentIndex < tabOrder.length - 1) {
        this.setActiveTab(tabOrder[currentIndex + 1]);
      }
    }
    
    prevStep() {
      const tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];
      const currentIndex = tabOrder.indexOf(this.activeTab);
    
      if (currentIndex > 0) {
        this.setActiveTab(tabOrder[currentIndex - 1]);
      }
    }

    addOrUpdateStudent(studentForm?: NgForm) {
      this.studentService.addEditStudent(this.studentData).subscribe({
        next: (response) => {
          this.studentData = { ...this.studentData, student_Id: response.studentId }; 
          console.log('Student added/updated:', response);
          this.showSuccessSnackbar('Student Added Successfully.');
          if (studentForm) studentForm.resetForm();
          this.setActiveTab('assignTrainings');
        },
        error: (error) => {
          console.error('Error adding/updating student:', error);
        }
      });
    }

    assignTrainings() {
      console.log("Assigning trainings for student ID:", this.studentData.student_Id);
    
      if (!this.studentData.student_Id) {
        this.showErrorSnackbar("Student not found. Please add student first.");
        return;
      }
    
      const selectedTrainingIds = this.trainings
        .filter(training => training.selected)
        .map(training => training.training_id).join(",");
        
      if (selectedTrainingIds.length === 0) {
        this.showErrorSnackbar("No trainings selected.");
        return;
      }
    
      const requestPayload = {
        studentId: this.studentData.student_Id,
        trainingIds: selectedTrainingIds 
      };
        
      this.studentService.assignTrainings(requestPayload).subscribe({
        next: (response) => {
          console.log("API Response:", response);
          this.showSuccessSnackbar('Trainings assigned successfully.');
          this.setActiveTab('reviewConfirm'); 
        },
        error: (error) => {
          console.error("API Error:", error);
          this.showErrorSnackbar('Failed to assign trainings.');
        }
      });
    }
    
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
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
    

    showSuccessSnackbar(message: string) {
      this.snackBar.open(message, 'X', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['app-notification-success']
      });
    }
  
    showErrorSnackbar(message: string) {
      this.snackBar.open(message, 'X', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['app-notification-error']
      });
    }
  }
  
