import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utility } from '../../utils/utility';
import { DataSocioVO, KapmaeRequestVO } from '../../utils/modelsVos';

@Injectable({
  providedIn: 'root'
})
export class KapmaeService {

  public utility = new Utility;

  constructor(private http: HttpClient) { }

  public new(userData: DataSocioVO): Observable<any> {
    let url = this.utility.getBasePath() + '/kapmae';
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.post(
      url,
      userData,
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

  public edit(userData: DataSocioVO): Observable<any> {
    let url = this.utility.getBasePath() + '/kapmae';
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.patch(
      url,
      userData,
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

  public delete(rut_cop: string, cod_cop: number): Observable<any> {
    let url = this.utility.getBasePath() + '/kapmae/delete';
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.post(
      url,
      {
        rut_cop: rut_cop,
        cod_cop: cod_cop,
      },
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

  public findByFilter(req: KapmaeRequestVO): Observable<any> {
    let url = this.utility.getBasePath() + '/kapmae/findByFilter';
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

  public findImgByCodCop(codCop: number): Observable<any> {
    let url = this.utility.getBasePath() + '/kapmae/findImgByCodCop/' + codCop;
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.get(
      url,
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

  public impromirPdfImagens(imgHabilitados: ReqImg): Observable<any> {
    let url = this.utility.getBasePath() + '/kapmae/getPdfDocumentImg';
    let user = JSON.parse(localStorage.getItem('datatoken')!);
    let headerParam = { 'Content-Type': 'application/json', 'Authorization': '', 'Accept': '' };
    headerParam.Authorization = 'Bearer ' + user.token;
    const ladata: Observable<any> = this.http.post(
      url,
      imgHabilitados,
      { headers: new HttpHeaders(headerParam), observe: 'response' }
    );
    return ladata;
  }

}
export interface ReqImg {
  imgs: string[];
  codCop: number;
  rutCop: string;
}
export class ReqImg {
  constructor() { }
}