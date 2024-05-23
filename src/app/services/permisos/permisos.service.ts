import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PermisosRequest } from '../../component/permisos/model/PermisosRequest';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    let url = 'http://localhost:3000/permisos';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

  public new(name: string, descrip: string, code: string, estado: boolean): Observable<any> {
    let url = 'http://localhost:3000/permisos';
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
    let url = 'http://localhost:3000/permisos/' + id;
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
    let url = 'http://localhost:3000/permisos/' + id;
    const ladata: Observable<any> = this.http.delete(
      url
    );
    return ladata;
  }

  public obtenerByFilter(req: PermisosRequest): Observable<any> {
    let url = 'http://localhost:3000/permisos/findByFilter';
    const ladata: Observable<any> = this.http.post(
      url,
      req
    );
    return ladata;
  }

}
