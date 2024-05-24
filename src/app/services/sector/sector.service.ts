import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  constructor(private http: HttpClient) { }

  public obtenerSectorById(id: number): Observable<any> {
    let url = 'http://localhost:3000/sector';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }
/*
  public obtenerByFilter(req: KapmaeRequest): Observable<any> {
    let url = 'http://localhost:3000/sector/findByFilter';
    const ladata: Observable<any> = this.http.post(
      url,
      req
    );
    return ladata;
  }
*/
}
