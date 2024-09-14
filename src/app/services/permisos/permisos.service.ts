import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PermisosRequest } from '../../component/perfilamiento/permisos/model/PermisosRequest';
import { Utility } from '../../utils/utility';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  public utility = new Utility;

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    let url = this.utility.getBasePath() + '/permisos';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

  public new(name: string, descrip: string, code: string, estado: boolean): Observable<any> {
    let url = this.utility.getBasePath() + '/permisos';
    const ladata: Observable<any> = this.http.post(
      url,
      {
        name,
        descrip,
        code,
        estado
      }
    );
    return ladata;
  }

  public update(id: number, name: string, descrip: string, code: string, estado: boolean): Observable<any> {
    let url = this.utility.getBasePath() + '/permisos/' + id;
    let userData: any = {
      name,
      descrip,
      code,
      estado
    };
    const ladata: Observable<any> = this.http.patch(
      url,
      userData
    );
    return ladata;
  }

  public delete(id: number): Observable<any> {
    let url = this.utility.getBasePath() + '/permisos/' + id;
    const ladata: Observable<any> = this.http.delete(
      url
    );
    return ladata;
  }

  public obtenerByFilter(req: PermisosRequest): Observable<any> {
    let url = this.utility.getBasePath() + '/permisos/findByFilter';
    const ladata: Observable<any> = this.http.post(
      url,
      req
    );
    return ladata;
  }

}
