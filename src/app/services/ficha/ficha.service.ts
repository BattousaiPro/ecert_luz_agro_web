import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KapmaeRequest } from '../../component/page/kapmae/model/KapmaeRequest';
import { DataSocio } from '../../component/page/kapmae/model/DataSocio';

@Injectable({
  providedIn: 'root'
})
export class FichaService {

  constructor(private http: HttpClient) { }

  public getnios(): Observable<any> {
    let url = 'http://localhost:3000/ficha/anios';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

}
