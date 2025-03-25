import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {
  private apiBase = "https://localhost:7172/api/DisplayData/DisplayTrainingTrascript";
  // private searchapi = "https://localhost:7172/api/Search/SearchTranscript?searchValue=a";

  constructor(private http: HttpClient) { }

  getTranscript(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/${studentId}`);
  }
}
