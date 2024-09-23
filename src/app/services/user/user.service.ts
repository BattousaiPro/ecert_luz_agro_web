import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Utility } from '../../utils/utility';
import { UsuariosRequestVO } from '../../utils/modelsVos';

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

  get isLogged(): Observable<boolean> {
    return this.loggedin.asObservable();
  }

  public getAll(): Observable<any> {
    let url = this.utility.getBasePath() + '/users';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

  public login(username: string, password: string): Observable<any> {
    let url = this.utility.getBasePath() + '/auth/login';
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
    let url = this.utility.getBasePath() + '/users';
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
    let url = this.utility.getBasePath() + '/users/' + id;
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
    let url = this.utility.getBasePath() + '/users/' + id;
    const ladata: Observable<any> = this.http.delete(
      url
    );
    return ladata;
  }

  public obtenerByFilter(req: UsuariosRequestVO): Observable<any> {
    let url = this.utility.getBasePath() + '/users/findByFilter';
    const ladata: Observable<any> = this.http.post(
      url,
      req
    );
    return ladata;
  }

  public logIn(): void {
    this.loggedin.next(true);
  }

  public logOut(): void {
    this.loggedin.next(false);
  }

  checkToken(): void {
    const token = this.utility.validateToken();
    const iExpired = helper.isTokenExpired(token);
    iExpired ? this.logOut() : this.loggedin.next(true);;
  }

}
