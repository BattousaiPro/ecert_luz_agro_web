import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  constructor(private http: HttpClient) { }

  public obtenerPermisos(): Observable<any> {
    let url = 'http://localhost:3000/permisos';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

}
