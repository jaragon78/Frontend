import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs';
import { StorageService } from './storage.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  AUTH_API = 'http://localhost:8080/api/auth/';
//  currentUserSubject: BehaviorSubject<any>;
  constructor(private http: HttpClient, private storageService: StorageService) {
    console.log("El servicio de autenticacion esta corriendo");
 //   this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser')||'{}'))
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      this.AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register( nombre: string, apellido: string, username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      this.AUTH_API + 'signup',
      {
        nombre,
        apellido,
        username,
        email,
        password,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(this.AUTH_API + 'signout', { }, {responseType: 'text'});
  }

  get usuarioAutenticado(){
    return this.storageService.getUser();
  }
}