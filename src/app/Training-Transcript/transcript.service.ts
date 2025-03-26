import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {
  private apiBase = "https://localhost:7172/api/DisplayData/DisplayTrainingTrascript";
  private searchapi = "https://localhost:7172/api/Search/SearchTranscript";
  private apibyid = "https://localhost:7172/api/DisplayData/GetTranscriptByID"


  constructor(private http: HttpClient) { }

  getTranscript(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/${studentId}`);
  }

  searchTranscript(query: string, studentId: number): Observable<any> {
    return this.http.get(`${this.searchapi}?searchValue=${encodeURIComponent(query)}&studentID=${studentId}`);
  }

  getTranscriptByID(transcritpId:number):Observable<any>{
    return this.http.get<any>(`${this.apibyid}/${transcritpId}`);
  }

}
