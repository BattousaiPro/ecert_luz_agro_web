import { HttpClient } from '@angular/common/http';
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
    const ladata: Observable<any> = this.http.post(
      url,
      userData
    );
    return ladata;
  }

  public edit(userData: DataSocioVO): Observable<any> {
    let url = this.utility.getBasePath() + '/kapmae';
    const ladata: Observable<any> = this.http.patch(
      url,
      userData
    );
    return ladata;
  }

  public delete(rut_cop: string, cod_cop: number): Observable<any> {
    let url = this.utility.getBasePath() + '/kapmae/delete';
    const ladata: Observable<any> = this.http.post(
      url,
      {
        rut_cop: rut_cop,
        cod_cop: cod_cop,
      }
    );
    return ladata;
  }

  public obtenerByFilter(req: KapmaeRequestVO): Observable<any> {
    let url = this.utility.getBasePath() + '/kapmae/findByFilter';
    const ladata: Observable<any> = this.http.post(
      url,
      req
    );
    return ladata;
  }

  public findImgByCodCop(codCop: number): Observable<any> {
    let url = this.utility.getBasePath() + '/kapmae/findImgByCodCop/' + codCop;
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

  public impromirPdfImagens(imgHabilitados: ReqImg): Observable<any> {
    let url = this.utility.getBasePath() + '/kapmae/getPdfDocumentImg';
    const ladata: Observable<any> = this.http.post(
      url,
      imgHabilitados
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