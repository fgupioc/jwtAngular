import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../auth.service';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(e => {
        if (e.status == 401) {
          if (this.auth.isAuthenticated()) {
            this.auth.cerrarSesion();
          }
          this.router.navigate(['/login']);
        }

        if (e.status == 403) {
          alert('acceso de negadd ' + this.auth.usuario.nombre);
          this.router.navigate(['/clientes']);
        }
        return throwError(e);
      })
    );
  }
}
