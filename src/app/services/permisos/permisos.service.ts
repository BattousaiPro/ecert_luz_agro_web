import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  constructor(private http: HttpClient) { }

  public obtenerPermisos(): Observable<any> {
    let url = 'http://localhost:3000/permisos';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

  public newUser(name: string, descrip: string, code: string, estado: boolean): Observable<any> {
    let url = 'http://localhost:3000/permisos';
    const ladata: Observable<any> = this.http.post(
      url,
      {
        name, descrip, code, estado
      }
    );
    return ladata;
  }
  /*
    public updateUser(id: number, ctaUsr: string, ctaPass: string, ctaEmail: string, estado: boolean): Observable<any> {
      let url = 'http://localhost:3000/users/' + id;
      let userData: any = {
        ctaUsr: ctaUsr,
        ctaPass: ctaPass,
        ctaEmail: ctaEmail,
        estado: estado,
      };
      const ladata: Observable<any> = this.http.patch(
        url,
        userData
      );
      return ladata;
    }
  
    public deleteUser(id: number): Observable<any> {
      let url = 'http://localhost:3000/users/' + id;
      const ladata: Observable<any> = this.http.delete(
        url
      );
      return ladata;
    }*/

}
