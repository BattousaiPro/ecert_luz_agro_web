import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public obtenerUser(): Observable<any> {
    let url = 'http://localhost:3000/users';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

  public access(username: string, password: string): Observable<any> {
    let url = 'http://localhost:3000/user/access';
    const ladata: Observable<any> = this.http.post(
      url,
      {
        ctaUsr: username,
        ctaPass: password
      }, { observe: 'response' }
    );
    return ladata;
  }

}
