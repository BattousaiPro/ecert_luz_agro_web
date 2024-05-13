import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public access(username: string, password: string): Observable<any> {
    //let seguro: any = this.autenticationValue();
    //let url = environment.urlCargaDirecta + '/general/category/findAll';
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
