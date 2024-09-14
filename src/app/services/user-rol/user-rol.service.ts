import { HttpClient } from '@angular/common/http';
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
    let url = this.utility.getBasePath() + '/user-rol/' + idUser;
    const ladata: Observable<any> = this.http.post(
      url,
      {
        listRolesId: listRolesId
      }
    );
    return ladata;
  }

}
