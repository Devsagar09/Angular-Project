import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdpService {
  
  private apiBase = "https://localhost:7172/api/DisplayData/DisplayIDP"; 
  private searchapi = "https://localhost:7172/api/Search/SearchIDP";

  constructor(private http: HttpClient) { }

    getIDPTrainings(studentId: number): Observable<any> {
      return this.http.get<any>(`${this.apiBase}/${studentId}`);
    }

    searchIDP(query:string,studentId:number): Observable<any> {
      return this.http.get(`${this.searchapi}?searchValue=${encodeURIComponent(query)}&studentID=${studentId}`);
    }

    // searchdIDP(query: string): Observable<any> {
    //   const apiUrl = `https://localhost:1234/api/Search/SearchTranscript?searchValue=${encodeURIComponent(query)}`;
    //   return this.http.get(apiUrl);
    // }
  
}
