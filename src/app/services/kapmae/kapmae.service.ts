import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KapmaeRequest } from '../../component/page/kapmae/model/KapmaeRequest';

@Injectable({
  providedIn: 'root'
})
export class KapmaeService {

  constructor(private http: HttpClient) { }

  /*public new(codigo: number, descrip: string, estado: boolean): Observable<any> {
    let url = 'http://localhost:3000/sector';
    const ladata: Observable<any> = this.http.post(
      url,
      {
        codigo,
        descrip,
        estado
      }
    );
    return ladata;
  }

  public update(id: number, codigo: number, descrip: string, estado: boolean): Observable<any> {
    let url = 'http://localhost:3000/sector/' + id;
    let userData: any = {
      codigo,
      descrip,
      estado
    };
    const ladata: Observable<any> = this.http.patch(
      url,
      userData
    );
    return ladata;
  }*/

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

}
