import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
private apiUrl = 'https://localhost:7172/api/Student/GetStudents';
private searchUrl = 'https://localhost:7172/api/Student/searchStudent';
private addeditUrl = 'https://localhost:7172/api/Student/AddEditStudent';
private roleUrl ='https://localhost:7172/api/Role/GetRoles';
private baseUrl='https://localhost:7172/api';
private getstudUrl = 'https://localhost:7172/api/Student/GetStudentDetails';
private deleteUrl = 'https://localhost:7172/api/Student/DeleteStudents';
private updateProfileImageUrl = 'https://localhost:7172/api/Profile/EditStudentProfileImage';
private getEditProfile = 'https://localhost:7172/api/Profile/GetStudentProfile';
private editprofile = 'https://localhost:7172/api/Profile/EditStudentProfile'
private resetpasswordurl='https://localhost:7172/api/Auth/ResetPassword';
private checkcurrentpassword = 'https://localhost:7172/api/Auth/checkPassword';

  constructor(private http: HttpClient) { }

  getStudent():Observable<any>{
    return this.http.get<any[]>(this.apiUrl)
  }

  searchStudent(searchValue: string): Observable<any> {
    return this.http.get<any[]>(`${this.searchUrl}?searchValue=${searchValue}`);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.roleUrl);
  }

  addEditStudent(studentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Student/AddEditStudent`, studentData);
  }

  assignTrainings(assignData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/AssignTrainings/AssignTrainings`, assignData);
  }
  
  getStudentById(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.getstudUrl}/${studentId}`);
  }

  getAssignedTrainings(studentId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/AssignTrainings/GetTrainingIds/${studentId}`);
  }

  deleteStudents(studentIds: number[]): Observable<any> {
    return this.http.delete(`${this.deleteUrl}`, { body: studentIds });
  }

  updateProfileImage(studentId: number, profileImage: File, originalFilename: string): Observable<any> {
    const formData = new FormData();
    formData.append('profileImage', profileImage);
    formData.append('studentId', studentId.toString());
    formData.append('originalFilename', originalFilename); 

    return this.http.post<any>(this.updateProfileImageUrl, formData);
}

getStudentProfile(studentId: number): Observable<any> {
  return this.http.get<any>(`${this.getEditProfile}?studentId=${studentId}`);
}

editStudentProfile(studentData: any): Observable<any> {
  return this.http.post(`${this.editprofile}`, studentData);
}

resetPassword(student_Id: number,data: any): Observable<any> {
  return this.http.post(this.resetpasswordurl, {
    student_Id : student_Id,
    current_Password: data.currentPassword,
    new_Password: data.newPassword,
    confirm_Password: data.confirmPassword
  });
}

checkPassword(student_Id: number, password: string): Observable<any> {
  return this.http.post(this.checkcurrentpassword, { student_Id, password });
}

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
    container.style.top = '70px';
    container.style.right = '10px';
    container.style.zIndex = '1000';
    document.body.appendChild(container);
  }

  // Remove existing notification if any
  const existingNotification = document.getElementById(
    'current-notification'
  );
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
  const closeButton = notification.querySelector(
    'button'
  ) as HTMLButtonElement;
  closeButton.onclick = () => notification.remove();

  // Append the new notification to the container
  container.appendChild(notification);

  // Automatically remove the notification after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}
}