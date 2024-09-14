import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComunasRequest } from '../../component/page/comunas/model/ComunasRequest';
import { Utility } from '../../utils/utility';

@Injectable({
  providedIn: 'root'
})
export class ComunasService {

  public utility = new Utility;

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    let url = this.utility.getBasePath() + '/comunas';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

  public obtenerComunById(id: number): Observable<any> {
    let url = this.utility.getBasePath() + '/comunas/' + id;
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

  public new(codigo: number, descrip: string, estado: boolean): Observable<any> {
    let url = this.utility.getBasePath() + '/comunas';
    const ladata: Observable<any> = this.http.post(
      url,
      {
        codigo,
        descrip,
        estado
      }
    );
    return ladata;
  }

  public update(id: number, codigo: number, descrip: string, estado: boolean): Observable<any> {
    let url = this.utility.getBasePath() + '/comunas/' + id;
    let userData: any = {
      codigo,
      descrip,
      estado
    };
    const ladata: Observable<any> = this.http.patch(
      url,
      userData
    );
    return ladata;
  }

  public delete(id: number): Observable<any> {
    let url = this.utility.getBasePath() + '/comunas/' + id;
    const ladata: Observable<any> = this.http.delete(
      url
    );
    return ladata;
  }

  public obtenerByFilter(req: ComunasRequest): Observable<any> {
    let url = this.utility.getBasePath() + '/comunas/findByFilter';
    const ladata: Observable<any> = this.http.post(
      url,
      req
    );
    return ladata;
  }

}
