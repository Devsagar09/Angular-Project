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
  
}
