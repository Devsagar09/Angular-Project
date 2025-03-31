import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TrainingService {

  private studapiUrl = 'https://localhost:7172/api/Student/GetStudents';

  private apiUrl = 'https://localhost:7172/api/Training/getTraining';

  private TTapiUrl = 'https://localhost:7172/api/TrainingType/getTrainingType';

  private SearchapiUrl = 'https://localhost:7172/api/Training/searchTraining';

  private addTrainingapiUrl = 'https://localhost:7172/api/Training/addTraining';

  private SearchStudUrl = 'https://localhost:7172/api/Student/searchStudent';

  private assignStudentUrl = 'https://localhost:7172/api/AssignStudents/AssignStudents';

  constructor(private http: HttpClient) { }

  getTraining():Observable<any>{
    return this.http.get<any[]>(this.apiUrl)
  }

  getStudent():Observable<any>{
    return this.http.get<any[]>(this.studapiUrl)
  }

  getTrainingType():Observable<any>{
    return this.http.get<any[]>(this.TTapiUrl)
  }

  searchTraining(searchValue: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.SearchapiUrl}?searchValue=${searchValue}`);
  }

  searchStudent(searchValue: string): Observable<any> {
    return this.http.get<any[]>(`${this.SearchStudUrl}?searchValue=${searchValue}`);
  }

  // Add new training
  addTraining(formData: FormData): Observable<any> {
    return this.http.post<any>(this.addTrainingapiUrl, formData); // Use POST for FormData
  }

  assignStudents(payload: any): Observable<any> {
    return this.http.post(`${this.assignStudentUrl}`, payload);
  }
}
