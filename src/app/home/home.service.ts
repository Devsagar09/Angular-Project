import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private apiBase = "https://localhost:7172/api/DisplayData";
  private apiUrl = 'https://localhost:7172/api/CountStudentDashboard/getCountStudentDashboard';
  private starthomeTraining = "https://localhost:7172/api/ManageEnrollment"
  private gettrainingdata = "https://localhost:7172/api/DisplayData/GetTrainingDataByID";
  private getThumbnailImage = "https://localhost:7172/api/DisplayData";

  constructor(private http: HttpClient) { }

  getNotStartedTrainings(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/GetNotStarted/${studentId}`);
  }

  getInProgressTrainings(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/GetInProgress/${studentId}`);
  }

  getStudentChart(studentId: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${studentId}`);
  }

  getTrainingByID(trainingid: number, studentid: number): Observable<any> {
    return this.http.get<any>(`${this.gettrainingdata}/${trainingid}/${studentid}`);
  }

  startTraining(request: { studentId: number; trainingId: number }): Observable<string> {
    return this.http.post(`${this.starthomeTraining}/StartTrainingDirect`, request, {
      responseType: 'text' // Correct response type for plain text
    }) as Observable<string>;
  }

  requestTrainingApproval(request: { studentId: number; trainingId: number }): Observable<string> {
    return this.http.post(`${this.starthomeTraining}/RequestTrainingApproval`, request, {
      responseType: 'text' // Correct response type for plain text
    }) as Observable<string>;
  }

  completeTraining(request: { studentId: number; trainingId: number }): Observable<string> {
    return this.http.post(`${this.starthomeTraining}/CompletedTraining`, request, {
      responseType: 'text'
    }) as Observable<string>;
  }

  getTrainingDocument(fileName: string): Observable<Blob> {
    return this.http.get(`${this.starthomeTraining}/GetTrainingDocument/${fileName}`, { responseType: 'blob' });
  }

  getTrainingThumbnail(fileName: string, type: string) {
    return `${this.getThumbnailImage}/GetThumbnail?fileName=${fileName}&type=${type}`;
  }
}
