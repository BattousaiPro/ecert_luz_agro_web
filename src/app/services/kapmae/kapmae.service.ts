import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KapmaeRequest } from '../../component/page/kapmae/model/KapmaeRequest';
import { DataSocio } from '../../component/page/kapmae/model/DataSocio';

@Injectable({
  providedIn: 'root'
})
export class KapmaeService {

  constructor(private http: HttpClient) { }

  public new(userData: DataSocio): Observable<any> {
    let url = 'http://localhost:3000/kapmae';
    const ladata: Observable<any> = this.http.post(
      url,
      userData
    );
    return ladata;
  }

  public edit(userData: DataSocio): Observable<any> {
    let url = 'http://localhost:3000/kapmae';
    const ladata: Observable<any> = this.http.patch(
      url,
      userData
    );
    return ladata;
  }

  public delete(rut_cop: string, cod_cop: number): Observable<any> {
    let url = 'http://localhost:3000/kapmae/delete';
    const ladata: Observable<any> = this.http.post(
      url,
      {
        rut_cop: rut_cop,
        cod_cop: cod_cop,
      }
    );
    return ladata;
  }

  public obtenerByFilter(req: KapmaeRequest): Observable<any> {
    let url = 'http://localhost:3000/kapmae/findByFilter';
    const ladata: Observable<any> = this.http.post(
      url,
      req
    );
    return ladata;
  }

  public findImgByCodCop(codCop: number): Observable<any> {
    let url = 'http://localhost:3000/kapmae/findImgByCodCop/' + codCop;
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

}
