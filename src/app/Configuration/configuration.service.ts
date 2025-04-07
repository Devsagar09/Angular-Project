import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private displayCon = 'https://localhost:7172/api/Configuration/getConfiguration';

  private addorupdateCon = 'https://localhost:7172/api/Configuration/updateConfiguration';

  private displaylogo = 'https://localhost:7172/api/Profile/DisplayCompanyLogo';

  private setlogo = 'https://localhost:7172/api/Profile/SetCompanyLogo';


  constructor(private http: HttpClient) { }

  getConfig():Observable<any>{
    return this.http.get<any[]>(this.displayCon)
  }
  updateConfig(data: any): Observable<any> {
    return this.http.post(`${this.addorupdateCon}`, data);
  }

  displayLogo(): Observable<any> {
    return this.http.get<any>(`${this.displaylogo}`); 
  }

  uploadLogo(data: FormData): Observable<any> {
    return this.http.post<any>(this.setlogo, data);
  }
}
