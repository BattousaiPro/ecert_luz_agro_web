import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRolService {

  constructor(private http: HttpClient) { }

  public setRolToUser(idUser: number, listIdRoles: number[]): Observable<any> {
    let url = 'http://localhost:3000/user-rol/' + idUser;
    const ladata: Observable<any> = this.http.post(
      url,
      listIdRoles
    );
    return ladata;
  }

}
