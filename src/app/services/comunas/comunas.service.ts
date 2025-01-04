import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComunasRequestVO } from '../../utils/modelsVos';
import { Utility } from '../../utils/utility';

@Injectable({
  providedIn: 'root'
})
export class ComunasService {

  public utility = new Utility;

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    let url = this.utility.getBasePathNew() + '/comuna';
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.get(
      url,
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

  public obtenerComunById(id: number): Observable<any> {
    let url = this.utility.getBasePathNew() + '/comuna/' + id;
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.get(
      url,
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

  public new(codigo: number, descrip: string, estado: boolean): Observable<any> {
    let url = this.utility.getBasePathNew() + '/comuna';
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.post(
      url,
      {
        codigo,
        descrip,
        estado
      },
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

  public update(id: number, codigo: number, descrip: string, estado: boolean): Observable<any> {
    let url = this.utility.getBasePathNew() + '/comuna/' + id;
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    let userData: any = {
      codigo,
      descrip,
      estado
    };
    const ladata: Observable<any> = this.http.patch(
      url,
      userData,
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

  public delete(id: number): Observable<any> {
    let url = this.utility.getBasePathNew() + '/comuna/' + id;
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.delete(
      url,
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

  public findByFilter(req: ComunasRequestVO): Observable<any> {
    let url = this.utility.getBasePathNew() + '/comuna/findByFilter';
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
