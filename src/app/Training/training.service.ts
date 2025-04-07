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

  private delTrainingapiUrl = 'https://localhost:7172/api/Training/deleteTraining';

  private SearchStudUrl = 'https://localhost:7172/api/Student/searchStudent';

  private assignStudentUrl = 'https://localhost:7172/api/AssignStudents/AssignStudents';

  private updateTraUrl = 'https://localhost:7172/api/Training/updateTraining';

  private gettrainingbyidUrl = 'https://localhost:7172/api/Training/getTrainingById';

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

  assignStudents(assignData: any): Observable<any> {
    return this.http.post(`${this.assignStudentUrl}`, assignData);
  }

  // Send DELETE request with an array of IDs
  deleteTraining(trainingIds: number[]) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.request('DELETE', `${this.delTrainingapiUrl}`, {
      body: trainingIds,
      headers: headers
    });
  }

  getTrainingById(id: number): Observable<any> {
    return this.http.get<any>(`https://localhost:7172/api/Training/getTraining/${id}`);
  }

  updateTraining(trainingData: FormData): Observable<any> {
    return this.http.put(`${this.updateTraUrl}`, trainingData);
  }

  getTrainingByIds(id: number): Observable<any> {
    return this.http.get(`https://localhost:7172/api/Training/getTrainingById/${id}`);
  }
}
