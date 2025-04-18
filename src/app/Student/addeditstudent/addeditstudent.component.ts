import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../../Training/training.service';
import { StudentService } from '../student.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-addeditstudent',
  standalone: false,
  templateUrl: './addeditstudent.component.html',
  styleUrls: ['./addeditstudent.component.css']
})
export class AddeditstudentComponent implements OnInit {
  isLoading = false;
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
  itemsPerPageOptions: number[] = [2, 5, 10, 20, 50];
  showPassword: boolean = false;
  studentNumberExists: boolean = false;
  studentEmailExists: boolean = false;
  studentsList: any[] = []; // Store students data
 
  roles: any[] = [];
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
 
  isEditMode = false;
 
  constructor(private trainingService: TrainingService, private studentService: StudentService, private route: ActivatedRoute
  ) { }
 
  ngOnInit(): void {
    this.loadTrainings();
    this.getRoles();
    this.route.paramMap.subscribe(params => {
      const id = params.get('studentId'); // Fetch ID from URL
      if (id) {
        this.isEditMode = true;
        this.studentData.student_Id = +id; // Convert to number
        this.loadStudentData(this.studentData.student_Id);
        this.showSelectedOnly = true; // By default, show selected trainings only in edit mode
        this.updateFilteredTrainings();
      }
    });
  }
 
  loadStudentData(studentId: number): void {
    this.studentService.getStudentById(studentId).subscribe({
      next: (studentData) => {
        console.log('Student Data Fetched:', studentData); // Debugging
        if (studentData) {
          this.studentData = { ...studentData }; // Populate form fields
          this.fetchAssignedTrainings(studentId);
          console.log('Assigned Student ID:', this.studentData.student_Id);
        } else {
          console.warn('No student data found for ID:', studentId);
        }
      },
      error: (error) => {
        console.error('Error fetching student details:', error);
      }
    });
  }
 
  fetchAssignedTrainings(studentId: number): void {
    this.studentService.getAssignedTrainings(studentId).subscribe({
      next: (assignedIds: number[]) => {
        // Iterate through the available trainings and mark the ones assigned to the student as selected
        this.trainings.forEach(training => {
          training.selected = assignedIds.includes(training.training_id);
        });
        // If you are using filteredTrainings, you can also update them
        this.updateFilteredTrainings();
      },
      error: (error) => {
        console.error('Error fetching assigned trainings:', error);
      }
    });
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
        this.selectAll = false; // Reset select all state
        this.updateFilteredTrainings(); // Ensure filtered data is initialized
      },
      error: (err) => {
        console.error('Error fetching training data', err);
      }
    });
  }
 
  searchTraining(): void {
    const searchTerm = this.searchValue.trim().toLowerCase();

    let baseList = [...this.trainings];

    if (this.showSelectedOnly) {
      baseList = baseList.filter(trainig => trainig.selected);
    }
  
    if (!searchTerm) {
      this.filteredTrainings = [...baseList];
      this.noDataFound=this.filteredTrainings.length===0;
      // this.updateFilteredTrainings();
      return;
    }
  
      this.filteredTrainings = baseList.filter(t => {
          const training_name = t.training_name.toLowerCase() || '';
          const training_code= t.training_code.toLowerCase() || '';
          const training_type= t.trainingtype_name.toLowerCase() || '';

          return(
          training_name.includes(searchTerm) ||
          training_code.includes(searchTerm) ||
          training_type.includes(searchTerm)
          );
      });
          
      this.noDataFound = this.filteredTrainings.length === 0;
   
  }
  
  updateFilteredTrainings() {
    setTimeout(() => {
      const trimmedSearch = this.searchValue.trim().toLowerCase();
      let baseList = this.showSelectedOnly
      ? this.trainings.filter(training => training.selected)
      :[...this.trainings];
      if (!trimmedSearch) {
        this.filteredTrainings = baseList;
      }
      else{
        this.filteredTrainings = baseList.filter(t => {
          const training_name = t.training_name.toLowerCase() || '';
          const training_code = t.training_code.toLowerCase() || '';
          const training_type = t.trainingtype_name.toLowerCase() || '';
          return (
            training_name.includes(trimmedSearch) ||
            training_code.includes(trimmedSearch) ||
            training_type.includes(trimmedSearch)
            );
      });
    }
    this.noDataFound = this.filteredTrainings.length === 0;
    this.isLoading = false;
  }, 300);
}
 
  setActiveTab(tab: string) {
    // console.log(`Switching to tab: ${tab}, Student ID: ${this.studentData.student_Id}`);
    const tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];
    const currentIndex = tabOrder.indexOf(this.activeTab);
    const nextIndex = tabOrder.indexOf(tab);
 
    if (nextIndex > currentIndex && !this.completedTabs.includes(this.activeTab)) {
      if (this.activeTab === 'personInfo' && (!this.studentData.student_No || !this.studentData.firstname ||
        !this.studentData.lastname || !this.studentData.email || !this.studentData.role_Id)) {
        return;
      }
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
 
  nextStep(studentForm?: NgForm) {
    const tabOrder = ['personInfo', 'assignTrainings', 'reviewConfirm'];
 
    const currentIndex = tabOrder.indexOf(this.activeTab);
 
    if (this.activeTab === 'personInfo') {
      if (!this.studentData.student_No || !this.studentData.firstname || !this.studentData.lastname ||
        !this.studentData.email || !this.studentData.role_Id) {
 
        this.studentData.touchedFields = true; // Add a flag to trigger validation in the template
        this.studentService.showNotification("Please fill all required fields.",'error');
        return;
      }
      this.addOrUpdateStudent();
    } else if (this.activeTab === 'assignTrainings') {
      this.assignTrainings();
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
    this.studentService.showNotification("Data saved.",'success');
    this.addOrUpdateStudent(); // Save student first
    setTimeout(() => {
      this.assignTrainings(); // Then assign trainings
    }, 200);
  }
 
  saveAndExit() {
    this.studentService.showNotification("Data saved Successfully.",'success');
    this.addOrUpdateStudent(); // Save student first
    setTimeout(() => {
      this.assignTrainings(); // Assign trainings
      setTimeout(() => {
        window.location.href = '/Student'; // Redirect after everything is saved
      }, 300);
    }, 200);
  }
 
 
  readyToFinish() {
    if (!this.studentData.student_No || !this.studentData.firstname ||
      !this.studentData.lastname || !this.studentData.email || !this.studentData.role_Id) {
 
      this.studentData.touchedFields = true;
      this.studentService.showNotification("Please fill all required fields.",'error');
      return;
    }
 
    this.addOrUpdateStudent(); // Ensure student is saved first
 
    if (!this.completedTabs.includes('assignTrainings')) {
      this.completedTabs.push('personInfo');
      this.completedTabs.push('assignTrainings');
    }
    setTimeout(() => {
      this.activeTab = 'reviewConfirm'; // Ensure tab is set correctly
    }, 100);
  }
 
 
  addOrUpdateStudent(studentForm?: NgForm) {  
    if (this.studentData.student_Id && this.studentData.student_Id > 0) {
      console.log("Updating student...");
 
      this.studentService.addEditStudent(this.studentData).subscribe({
        next: (response) => {
          console.log("Full API Response (Update):", response);
 
          if (response?.studentId) {
            this.studentData.student_Id = response.studentId;
            console.log("Updated Student ID:", this.studentData.student_Id);
            this.loadStudentData(this.studentData.student_Id);
 
            this.setActiveTab(this.activeTab === 'personInfo' ? 'assignTrainings' : 'reviewConfirm');
            this.studentService.showNotification("student Updated.",'success');
            studentForm?.resetForm();
          }
        },
        error: (error) => {
          console.error("API Error (Update):", error);
          this.studentService.showNotification('Failed to update student.','error');
        }
      });
 
    } else {
      console.log("Adding new student...");
 
      this.studentService.addEditStudent(this.studentData).subscribe({
        next: (response) => {
          console.log("Full API Response (Add):", response);
 
          if (response?.studentId) {
            this.studentData.student_Id = response.studentId;
            console.log("New Student ID:", this.studentData.student_Id);
 
            this.setActiveTab(this.activeTab === 'personInfo' ? 'assignTrainings' : 'reviewConfirm');
            this.studentService.showNotification("student Added.",'success');
 
            studentForm?.resetForm();
          }
        },
        error: (error) => {
          console.error("API Error (Add):", error);
          this.studentService.showNotification('Failed to add student.','error');
        }
      });
    }
  }
 
 
  assignTrainings() {
    console.log("Assigning trainings for student ID:", this.studentData.student_Id);
 
    if (!this.studentData.student_Id) {
      this.studentService.showNotification("Student not found. Please add student first.",'error');
      return;
    }
 
    const selectedTrainingIds = this.trainings
      .filter(training => {
        return training.selected && training.training_id;
      })
      .map(training => training.training_id)
      .join(",");
 
    const requestPayload = {
      studentId: this.studentData.student_Id,
      trainingIds: selectedTrainingIds
    };
 
    console.log("payload:", requestPayload);
 
    this.studentService.assignTrainings(requestPayload).subscribe({
      next: (response) => {
        console.log("API Response:", response);
        this.studentService.showNotification('Trainings assigned.','success');
        this.setActiveTab('reviewConfirm');
      },
      error: (error) => {
        console.error("API Error:", error);
        this.studentService.showNotification('Failed to assign trainings.','error');
      }
    });
  }
 
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
 
  toggleSelectAll() {
    this.trainings.forEach((training) => training.selected = this.selectAll);
    // this.updateFilteredTrainings();
    }
 
  updateSelectAll() {
    this.selectAll = this.trainings.every(training => training.selected);
  }
 
  toggleShowSelected() {
    this.updateFilteredTrainings();
    // this.updateSelectAll(); // <-- make sure selectAll reflects the updated list
  }
 
}