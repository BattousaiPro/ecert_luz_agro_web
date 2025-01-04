import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utility } from '../../utils/utility';
import { RolesRequestVO } from '../../utils/modelsVos';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  public utility = new Utility;

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    let url = this.utility.getBasePathNew() + '/rol';
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.get(
      url,
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

  public new(name: string, descrip: string, code: string): Observable<any> {
    let url = this.utility.getBasePathNew() + '/rol';
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.post(
      url,
      {
        name,
        descrip,
        code,
      },
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

  public update(id: number, name: string, descrip: string, code: string, estado: boolean): Observable<any> {
    let url = this.utility.getBasePathNew() + '/rol/' + id;
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    let userData: any = {
      name,
      descrip,
      code,
      estado,
    };
    const ladata: Observable<any> = this.http.patch(
      url,
      userData,
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

  public delete(id: number): Observable<any> {
    let url = this.utility.getBasePathNew() + '/rol/' + id;
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.delete(
      url,
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

  public findByFilter(req: RolesRequestVO): Observable<any> {
    let url = this.utility.getBasePathNew() + '/rol/findByFilter';
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.post(
      url,
      req,
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

}
