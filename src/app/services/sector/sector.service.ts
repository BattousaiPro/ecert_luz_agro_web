import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utility } from '../../utils/utility';
import { SectoresRequestVO } from '../../utils/modelsVos';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  public utility = new Utility;

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    let url = this.utility.getBasePath() + '/sector';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

  public new(codigo: number, descrip: string, estado: boolean): Observable<any> {
    let url = this.utility.getBasePath() + '/sector';
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
    let url = this.utility.getBasePath() + '/sector/' + id;
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
    let url = this.utility.getBasePath() + '/sector/' + id;
    const ladata: Observable<any> = this.http.delete(
      url
    );
    return ladata;
  }

  public obtenerByFilter(req: SectoresRequestVO): Observable<any> {
    let url = this.utility.getBasePath() + '/sector/findByFilter';
    const ladata: Observable<any> = this.http.post(
      url,
      req
    );
    return ladata;
  }

}
