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
    studentNumberExists: boolean = false; 
    studentEmailExists: boolean = false; 
    studentsList: any[] = []; // Store students data

    roles: any[] = [];
    studentData: any = { role_Id: "",username: "", password: "", };
    
  constructor(private trainingService: TrainingService,private studentService : StudentService, private snackBar: MatSnackBar ){}
    
  ngOnInit(): void {
      this.loadTrainings();
      this.getRoles();  
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
          this.studentData.password = newUsername;
          },
        error: (err: any) => {
          console.error('Error fetching students:', err);
        }
      });
    }
    
  
    checkStudentNumber() {
      if (!this.studentData.student_No) {  
        this.studentNumberExists = false;
        return;
    }
      this.studentService.getStudent().subscribe({
          next: (students) => {
              this.studentNumberExists = students.some(
                  (student: { student_No: any; }) => student.student_No === this.studentData.student_No
              );
          },
          error: (err: any) => { 
              console.error('Error fetching students:', err);
          }
      });
  }

  checkEmail() {
    if (!this.studentData.email) {  
      this.studentEmailExists = false;
      return;
  }
    this.studentService.getStudent().subscribe({
        next: (students) => {
            this.studentEmailExists = students.some(
                (student: { email: any; }) => student.email === this.studentData.email
            );
        },
        error: (err: any) => { 
            console.error('Error fetching students:', err);
        }
    });
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
      // console.log(`Switching to tab: ${tab}, Student ID: ${this.studentData.student_Id}`);
    const tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];
    const currentIndex = tabOrder.indexOf(this.activeTab);
    const nextIndex = tabOrder.indexOf(tab);

    if (nextIndex > currentIndex && !this.completedTabs.includes(this.activeTab)) {
    //   if (this.activeTab === 'personInfo' && (!this.studentData.student_No || !this.studentData.firstname || 
    //     !this.studentData.lastname || !this.studentData.email || !this.studentData.role_Id)) {
    //   return; 
    // }
    for (let i = currentIndex; i < nextIndex; i++) {
      if (!this.completedTabs.includes(tabOrder[i])) {
          this.completedTabs.push(tabOrder[i]);
      }
  }
      this.completedTabs.push(this.activeTab);
      
    }

    if (nextIndex < currentIndex) {
      this.completedTabs = this.completedTabs.filter((completedTab) => {
          return tabOrder.indexOf(completedTab) <= nextIndex;
      });
  }

    this.activeTab = tab;
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 50);
  }

  getRoleNameById(roleId: any): string {
  
    if (!roleId) {
        console.warn('Role ID is undefined or empty.');
        return 'NA';
    }

    const role = this.roles.find(r => r.role_Id == roleId);
    return role ? role.role_Name : 'NA';
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
        if (!this.studentData.student_No || !this.studentData.firstname || !this.studentData.lastname || 
          !this.studentData.email || !this.studentData.role_Id) {
        
            this.studentData.touchedFields = true; // Add a flag to trigger validation in the template
            this.showErrorSnackbar("Please fill all required fields.");
        return; 
      }
        this.addOrUpdateStudent(); 
      } else if (this.activeTab === 'assignTrainings') {
        this.setActiveTab('reviewConfirm');
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

    saveReview() {
      this.addOrUpdateStudent(); 
      this.assignTrainings();
    }
    
    saveAndExit() {
      this.addOrUpdateStudent(); 
      this.assignTrainings();
      window.location.href = '/Student'; // Redirect to another page
    }

    readyToFinish() {
      if (!this.studentData.student_No || !this.studentData.firstname || 
          !this.studentData.lastname || !this.studentData.email || !this.studentData.role_Id) {
          
          this.studentData.touchedFields = true; 
          this.showErrorSnackbar("Please fill all required fields.");
          return; 
      }
  
      this.addOrUpdateStudent(); 

      if (!this.completedTabs.includes('assignTrainings')) {
        this.completedTabs.push('personInfo')
        this.completedTabs.push('assignTrainings');
    }
      // Use a small delay to ensure all operations complete before changing tabs
      setTimeout(() => {
          this.activeTab = 'reviewConfirm'; // Ensure tab is set correctly
      }, 50); 
  }
  
  
    

    addOrUpdateStudent(studentForm?: NgForm) {
      // console.log("Submitting student data:", this.studentData);
    
      this.studentService.addEditStudent(this.studentData).subscribe({
        next: (response) => {
          this.studentData = { ...this.studentData, student_Id: response.studentId }; 
          // console.log('Student added/updated:', response);
          this.showSuccessSnackbar('Student Added Successfully.');
          if (studentForm) studentForm.resetForm();
          if (this.activeTab !== 'reviewConfirm') {
            this.setActiveTab('assignTrainings'); 
        }
        },
        error: (error) => {
          console.error("API Error:", error);
          if (error.error) {
            console.error("Error Details:", error.error); 
          }
          this.showErrorSnackbar('Failed to add student.');
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
  
