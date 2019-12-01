import {Component, OnInit} from '@angular/core';
import {Usuario} from '../usuario';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: Usuario;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      alert('ya estas autenticado');
      this.router.navigate(['/clientes']);
    }
  }

  login() {
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      alert('no puede estar vacio');
      return;
    }

    this.authService.login(this.usuario).subscribe(
      response => {
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        const usuario = this.authService.usuario;
        const token = this.authService.token;
        console.log(usuario);
        console.log(token);
        this.router.navigate(['/clientes']);
      },
      error => {
        if (error.status == 400) {
          alert('Credenciales invalidas');
        }
      }
    );
  }
}
