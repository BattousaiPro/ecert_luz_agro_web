import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utility } from '../../utils/utility';

@Injectable({
  providedIn: 'root'
})
export class RolPermisoService {

  public utility = new Utility;

  constructor(private http: HttpClient) { }

  public setPermisoToRol(idRol: number, listPermisosId: number[]): Observable<any> {
    let url = this.utility.getBasePathNew() + '/rol-permiso/' + idRol;
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.post(
      url,
      {
        listPermisosId: listPermisosId
      },
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

}
