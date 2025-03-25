import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private apiBase = "https://localhost:7172/api/DisplayData/DisplayCourseCatalog";
  // private searchapi = "https://localhost:7172/api/Search/SearchIDP?searchValue=com";

  constructor(private http: HttpClient) { }

  getCCTrainings(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/${studentId}`);
  }
}
