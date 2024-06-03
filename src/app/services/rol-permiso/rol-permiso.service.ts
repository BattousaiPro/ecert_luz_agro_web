import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolPermisoService {

  constructor(private http: HttpClient) { }

  public setPermisoToRol(idRol: number, listIdPermisos: number[]): Observable<any> {
    let url = 'http://localhost:3000/rol-permiso/' + idRol;
    const ladata: Observable<any> = this.http.post(
      url,
      listIdPermisos
    );
    return ladata;
  }

}
