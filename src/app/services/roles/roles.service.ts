import { HttpClient } from '@angular/common/http';
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
    let url = this.utility.getBasePath() + '/roles';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

  public new(name: string, descrip: string, code: string): Observable<any> {
    let url = this.utility.getBasePath() + '/roles';
    const ladata: Observable<any> = this.http.post(
      url,
      {
        name,
        descrip,
        code,
      }
    );
    return ladata;
  }

  public update(id: number, name: string, descrip: string, code: string, estado: boolean): Observable<any> {
    let url = this.utility.getBasePath() + '/roles/' + id;
    let userData: any = {
      name,
      descrip,
      code,
      estado,
    };
    const ladata: Observable<any> = this.http.patch(
      url,
      userData
    );
    return ladata;
  }

  public delete(id: number): Observable<any> {
    let url = this.utility.getBasePath() + '/roles/' + id;
    const ladata: Observable<any> = this.http.delete(
      url
    );
    return ladata;
  }

  public obtenerByFilter(req: RolesRequestVO): Observable<any> {
    let url = this.utility.getBasePath() + '/roles/findByFilter';
    const ladata: Observable<any> = this.http.post(
      url,
      req
    );
    return ladata;
  }

}
