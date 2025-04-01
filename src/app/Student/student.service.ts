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
}