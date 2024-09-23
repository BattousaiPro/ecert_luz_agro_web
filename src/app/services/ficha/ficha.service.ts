import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utility } from '../../utils/utility';

@Injectable({
  providedIn: 'root'
})
export class FichaService {

  public utility = new Utility;

  constructor(private http: HttpClient) { }

  public getnios(): Observable<any> {
    let url = this.utility.getBasePath() + '/ficha/anios';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

}
