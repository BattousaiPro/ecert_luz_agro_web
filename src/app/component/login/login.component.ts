import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) { }

  validarFormulario() {
    if (this.username === '' || this.password === '') {
      alert('Todos los campos son obligatorios');
    } else {
      if (!this.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
        alert('La contraseña debe ser alfanumérica y tener al menos 8 caracteres');
      } else {
        this.router.navigate(['infosocio']);
      }
    }
  }

}
