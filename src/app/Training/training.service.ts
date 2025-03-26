import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private apiUrl = 'https://localhost:7172/api/Training/getTraining'; // Update with your API URL

  private TTapiUrl = 'https://localhost:7172/api/TrainingType/getTrainingType'; // Update with your API URL

  private SearchapiUrl = 'https://localhost:7172/api/Training/searchTraining'; // Update with your API URL

  private addTrainingapiUrl = 'https://localhost:7172/api/Training';

  constructor(private http: HttpClient) { }

  getTraining():Observable<any>{
    return this.http.get<any[]>(this.apiUrl)
  }

  getTrainingType():Observable<any>{
    return this.http.get<any[]>(this.TTapiUrl)
  }

  searchTraining(searchValue: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.SearchapiUrl}?searchValue=${searchValue}`);
  }

  // Add training
  addTraining(trainingData: any): Observable<any> {
    const url = `${this.addTrainingapiUrl}/addTraining`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, trainingData, { headers }).pipe(
      timeout(30000), // 30 seconds timeout
      catchError((error) => {
        console.error('API Timeout or Error:', error);
        return throwError(error);
      })
    );
  }
}
