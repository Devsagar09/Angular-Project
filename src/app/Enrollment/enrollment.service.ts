import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private apiBase = "https://localhost:7172/api/DisplayData/DisplayEnrollment"
  private searchapi = "https://localhost:7172/api/Search/SearchEnroll"
  private startEnrollTraining = "https://localhost:7172/api/ManageEnrollment"
  private gettrainingdata = "https://localhost:7172/api/DisplayData/GetTrainingDataByID";

  constructor(private http: HttpClient) { }

  getEnrollment(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/${studentId}`);
  }

  searchEnrollment(query: string, studentId: number): Observable<any> {
    return this.http.get(`${this.searchapi}?searchValue=${encodeURIComponent(query)}&studentID=${studentId}`);
  }

  startTraining(request: { studentId: number; trainingId: number }): Observable<string> {
    return this.http.post(`${this.startEnrollTraining}/StartTrainingDirect`, request, {
      responseType: 'text' // Correct response type for plain text
    }) as Observable<string>;
  }

  requestTrainingApproval(request: { studentId: number; trainingId: number }): Observable<string> {
    return this.http.post(`${this.startEnrollTraining}/RequestTrainingApproval`, request, {
      responseType: 'text' // Correct response type for plain text
    }) as Observable<string>;
  }

  getTrainingByID(trainingid: number): Observable<any> {
    return this.http.get<any>(`${this.gettrainingdata}/${trainingid}`);
  }


  getTrainingDocument(fileName: string): Observable<Blob> {
    return this.http.get(`${this.startEnrollTraining}/GetTrainingDocument/${fileName}`, { responseType: 'blob' });
  }

   completeTraining(request: { studentId: number; trainingId: number }): Observable<string> {
      return this.http.post(`${this.startEnrollTraining}/CompletedTraining`, request, {
        responseType: 'text' // Correct response type for plain text
      }) as Observable<string>;
    }

}
