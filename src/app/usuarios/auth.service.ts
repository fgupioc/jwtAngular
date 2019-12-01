import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Usuario} from './usuario';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:8080/oauth/token';
  private _usuario: Usuario;
  private _token: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  login(usuario: Usuario): Observable<any> {
    const credenciales = btoa('angularapp' + ':' + '12345');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });
    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    return this.http.post<any>(this.url, params.toString(), {headers: httpHeaders});
  }

  guardarUsuario(access_token: any) {
    const payload = this.obtenertDatosToken(access_token);
    this._usuario = new Usuario();
    this._usuario.username = payload.user_name;
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.roles = payload.authorities;

    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(access_token: any) {
    this._token = access_token;
    sessionStorage.setItem('token', this._token);
  }

  obtenertDatosToken(access_token: any) {
    if (access_token == null) {
      return null;
    }
    return JSON.parse(atob(access_token.split('.')[1]));
  }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario')) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token')) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  isAuthenticated(): boolean {
    const payload = this.obtenertDatosToken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  cerrarSesion() {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    this.router.navigate(['clientes']);
  }

  hasRol(role: string) {
    if (this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }
}
