import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private apiUrl = 'https://localhost:7172/api/Training/getTraining'; // Update with your API URL

  constructor(private http: HttpClient) { }

  getTraining():Observable<any>{
    return this.http.get<any[]>(this.apiUrl)
  }
}
