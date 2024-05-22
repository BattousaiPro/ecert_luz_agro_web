import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KapmaeRequest } from '../../component/page/info-socio/info-socio.component';

@Injectable({
  providedIn: 'root'
})
export class KapmaeService {

  constructor(private http: HttpClient) { }

  public obtenerKapMae(): Observable<any> {
    let url = 'http://localhost:3000/kapmae';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

  public obtenerKapMaeByFilter(req: KapmaeRequest): Observable<any> {
    let url = 'http://localhost:3000/kapmae/findByFilter';
    const ladata: Observable<any> = this.http.post(
      url,
      req
    );
    return ladata;
  }

}
