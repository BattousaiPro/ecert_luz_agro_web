import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    let url = 'http://localhost:3000/roles';
    const ladata: Observable<any> = this.http.get(
      url
    );
    return ladata;
  }

  public new(name: string, descrip: string): Observable<any> {
    let url = 'http://localhost:3000/roles';
    const ladata: Observable<any> = this.http.post(
      url,
      {
        name: name,
        descrip: descrip,
      }
    );
    return ladata;
  }

  public update(id: number, name: string, descrip: string, estado: boolean): Observable<any> {
    let url = 'http://localhost:3000/roles/' + id;
    let userData: any = {
      name: name,
      descrip: descrip,
      estado: estado,
    };
    const ladata: Observable<any> = this.http.patch(
      url,
      userData
    );
    return ladata;
  }

  public delete(id: number): Observable<any> {
    let url = 'http://localhost:3000/roles/' + id;
    const ladata: Observable<any> = this.http.delete(
      url
    );
    return ladata;
  }

}
