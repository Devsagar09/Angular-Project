import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdpService {
  
  private apiBase = "https://localhost:7172/api/DisplayData/DisplayIDP"; 
  private searchapi = "https://localhost:7172/api/Search/SearchIDP";
  private startIDPTraining = "https://localhost:7172/api/ManageEnrollment"
  private gettrainingdata = "https://localhost:7172/api/DisplayData/GetTrainingDataByID";


    // https://localhost:7172/api/ManageEnrollment/StartTraining 
  //https://localhost:7172/api/DisplayData/GetTrainingDataByID/
  //https://localhost:7172/api/ManageEnrollment/CompletedTraining

  constructor(private http: HttpClient) { }

    getIDPTrainings(studentId: number): Observable<any> {
      return this.http.get<any>(`${this.apiBase}/${studentId}`);
    }

    getTrainingByID(trainingid:number):Observable<any>{
      return this.http.get<any>(`${this.gettrainingdata}/${trainingid}`);
    }

    searchIDP(query:string,studentId:number): Observable<any> {
      return this.http.get(`${this.searchapi}?searchValue=${encodeURIComponent(query)}&studentID=${studentId}`);
    }

    startTraining(request: { studentId: number; trainingId: number }): Observable<string> {
      return this.http.post(`${this.startIDPTraining}/StartTrainingDirect`, request, {
        responseType: 'text' // Correct response type for plain text
      }) as Observable<string>;
    }

    requestTrainingApproval(request: { studentId: number; trainingId: number }): Observable<string> {
      return this.http.post(`${this.startIDPTraining}/RequestTrainingApproval`, request, {
        responseType: 'text' // Correct response type for plain text
      }) as Observable<string>;
    }
    
    completeTraining(request: { studentId: number; trainingId: number }): Observable<string> {
      return this.http.post(`${this.startIDPTraining}/CompletedTraining`, request, {
        responseType: 'text'  
      }) as Observable<string>;
    }
    
    // requestTrainingApproval(studentId: number, trainingId: number): Observable<string> {
    //   return this.http.post<string>(`${this.apiUrl}/RequestTrainingApproval`, { studentId, trainingId });
    // }
  
    // // Call API for starting training directly
    // startTraining(studentId: number, trainingId: number): Observable<string> {
    //   return this.http.post<string>(`${this.apiUrl}/StartTraining`, { studentId, trainingId });
    // }

    // searchdIDP(query: string): Observable<any> {
    //   const apiUrl = `https://localhost:1234/api/Search/SearchTranscript?searchValue=${encodeURIComponent(query)}`;
    //   return this.http.get(apiUrl);
    // }
  
}
