import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuariosRequest } from '../../component/usuarios/model/UsuariosRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    let url = 'http://localhost:3000/users';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

  public login(username: string, password: string): Observable<any> {
    let url = 'http://localhost:3000/auth/login';
    let userData: any = {
      ctaUserName: username,
      ctaPassWord: password
    };
    const ladata: Observable<any> = this.http.post(
      url,
      userData
    );
    return ladata;
  }

  public new(ctaUserName: string, ctaPassWord: string, ctaEmail: string): Observable<any> {
    let url = 'http://localhost:3000/users';
    const ladata: Observable<any> = this.http.post(
      url,
      {
        ctaUserName,
        ctaPassWord,
        ctaEmail
      }
    );
    return ladata;
  }

  public update(id: number, ctaUserName: string, ctaPassWord: string, ctaEmail: string, estado: boolean): Observable<any> {
    let url = 'http://localhost:3000/users/' + id;
    let userData: any = {
      ctaUserName,
      ctaPassWord,
      ctaEmail,
      estado,
    };
    const ladata: Observable<any> = this.http.patch(
      url,
      userData
    );
    return ladata;
  }

  public delete(id: number): Observable<any> {
    let url = 'http://localhost:3000/users/' + id;
    const ladata: Observable<any> = this.http.delete(
      url
    );
    return ladata;
  }

  public obtenerByFilter(req: UsuariosRequest): Observable<any> {
    let url = 'http://localhost:3000/users/findByFilter';
    const ladata: Observable<any> = this.http.post(
      url,
      req
    );
    return ladata;
  }

}
