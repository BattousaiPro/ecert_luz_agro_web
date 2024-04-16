import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  validarFormulario() {
    if (this.username === '' || this.password === '') {
      alert('Todos los campos son obligatorios');
    } else {
      if (!this.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
        alert('La contraseña debe ser alfanumérica y tener al menos 8 caracteres');
      } else {
        // Aquí puedes agregar tu lógica para autenticar al usuario
        alert('Inicio de sesión exitoso');
        // Por ejemplo, redirigir a otra página
        //window.location.href = 'pagina_principal.html';
      }
    }
  }

}
