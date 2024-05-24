import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunasService {

  constructor(private http: HttpClient) { }

  public obtenerComunById(id: number): Observable<any> {
    let url = 'http://localhost:3000/comunas/' + id;
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }
/*
  public obtenerByFilter(req: ComunasRequest): Observable<any> {
    let url = 'http://localhost:3000/comunas/findByFilter';
    const ladata: Observable<any> = this.http.post(
      url,
      req
    );
    return ladata;
  }
*/
}
