import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private apiBase = "https://localhost:7172/api/DisplayData/DisplayCourseCatalog";
  private searchapi = "https://localhost:7172/api/Search/SearchCC";
  private startCCTraining = "https://localhost:7172/api/ManageEnrollment"
  private gettrainingdata = "https://localhost:7172/api/DisplayData/GetTrainingDataByID";
  private getThumbnailImage = "https://localhost:7172/api/DisplayData";


  constructor(private http: HttpClient) { }

  getCCTrainings(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/${studentId}`);
  }

  searchCC(studentId: number, query: string): Observable<any> {
    return this.http.get(`${this.searchapi}?studentID=${studentId}&searchValue=${encodeURIComponent(query)}`);
  }

  startTraining(request: { studentId: number; trainingId: number }): Observable<string> {
    return this.http.post(`${this.startCCTraining}/StartTrainingDirect`, request, {
      responseType: 'text' // Correct response type for plain text
    }) as Observable<string>;
  }

  completeTraining(request: { studentId: number; trainingId: number }): Observable<string> {
    return this.http.post(`${this.startCCTraining}/CompletedTraining`, request, {
      responseType: 'text' // Correct response type for plain text
    }) as Observable<string>;
  }

  requestTrainingApproval(request: { studentId: number; trainingId: number }): Observable<string> {
    return this.http.post(`${this.startCCTraining}/RequestTrainingApproval`, request, {
      responseType: 'text' // Correct response type for plain text
    }) as Observable<string>;
  }

  getTrainingByID(trainingid: number): Observable<any> {
    return this.http.get<any>(`${this.gettrainingdata}/${trainingid}`);
  }

  getTrainingDocument(fileName: string): Observable<Blob> {
    return this.http.get(`${this.startCCTraining}/GetTrainingDocument/${fileName}`, { responseType: 'blob' });
  }

  getTrainingThumbnail(fileName: string, type: string) {
    return `${this.getThumbnailImage}/GetThumbnail?fileName=${fileName}&type=${type}`;
  }

}
