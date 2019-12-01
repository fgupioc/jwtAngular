import {Component} from '@angular/core';
import {AuthService} from '../usuarios/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  title: string = 'App Angular';

  constructor(
    private auth: AuthService
  ) {
  }

  salir() {
    this.auth.cerrarSesion();
  }
}
