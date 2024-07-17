import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UsuariosRequest } from '../../component/perfilamiento/usuarios/model/UsuariosRequest';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Utility } from '../../utils/utility';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public utility = new Utility;
  private loggedin = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  get isLoggedin(): Observable<boolean> {
    return this.loggedin.asObservable();
  }

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
    ).pipe(
      map((res: any) => {
        this.loggedin.next(true);
        return res;
      })
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

  public logOut(): void {
    localStorage.removeItem('datatoken');
    this.loggedin.next(false);
  }

  checkToken(): void {
    const token = this.utility.validateToken();
    const iExpired = helper.isTokenExpired(token);
    iExpired ? this.logOut() : this.loggedin.next(true);;
  }

}
