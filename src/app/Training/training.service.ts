import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private apiUrl = 'https://localhost:7172/api/Training/getTraining'; // Update with your API URL

  private TTapiUrl = 'https://localhost:7172/api/TrainingType/getTrainingType'; // Update with your API URL

  constructor(private http: HttpClient) { }

  getTraining():Observable<any>{
    return this.http.get<any[]>(this.apiUrl)
  }

  getTrainingType():Observable<any>{
    return this.http.get<any[]>(this.TTapiUrl)
  }
}
