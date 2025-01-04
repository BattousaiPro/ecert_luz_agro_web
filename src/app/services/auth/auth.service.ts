import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Utility } from '../../utils/utility';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public utility = new Utility;
  private loggedin = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  get isLogged(): Observable<boolean> {
    return this.loggedin.asObservable();
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

  public logIn(): void {
    this.loggedin.next(true);
  }

  public logOut(): void {
    this.loggedin.next(false);
  }

  checkToken(): void {
    const token = this.utility.validateToken();
    const isExpired = helper.isTokenExpired(token);
    isExpired ? this.logOut() : this.loggedin.next(true);;
  }

}
