import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  public obtenerRoles(): Observable<any> {
    let url = 'http://localhost:3000/roles';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

}
