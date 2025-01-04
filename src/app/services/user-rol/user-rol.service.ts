import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utility } from '../../utils/utility';

@Injectable({
  providedIn: 'root'
})
export class UserRolService {

  public utility = new Utility;

  constructor(private http: HttpClient) { }

  public setRolToUser(idUser: number, listRolesId: number[]): Observable<any> {
    let url = this.utility.getBasePathNew() + '/user-rol/' + idUser;
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.post(
      url,
      {
        listRolesId: listRolesId
      },
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

}
