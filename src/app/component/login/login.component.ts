import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { SpinnerComponent } from '../utilitarios/spinner/spinner.component';
import { ModalOptions } from '../../utils/modalOptions';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = 'adminCop';
  password: string = 'asd';
  cargar: boolean = false;

  modals = new ModalOptions();

  constructor(private userService: UserService,
    private router: Router) { }

  validarFormulario() {
    if (this.username === '' || this.password === '') {
      this.modals.info('Todos los campos son obligatorios');
    } else {
      //if (!this.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
      //    this.modals.info('La contraseña debe ser alfanumérica y tener al menos 8 caracteres');
      //} else {
      //this.router.navigate(['home']);
      this.login();
      //}
    }
  }

  private login(): void {
    console.log('Cargando loadCargarRoles');
    this.cargar = true;
    localStorage.removeItem('datatoken');
    this.userService.login(this.username, this.password).subscribe(
      (data: any) => {
        // console.log(JSON.stringify(data));
        if (data.code === '0') {
          localStorage.setItem('datatoken', JSON.stringify(data.data));
          this.router.navigate(['home']);
        } else if (data.code === '-1' || data.code === '-2' || data.code === '-3') {
          console.log(data.message);
          this.modals.error(data.message);
        } else {
          //this.error.mostrarError('Error con la respuesta de servicios de Access');
          console.log('Error con servicio Login');
          this.modals.error('Error con servicio Login');
        }
        this.cargar = false;
      },
      (err: any) => {
        //this.error.mostrarError('Error con el Login');
        console.log('Error con el Login');
        this.cargar = false;
        this.modals.error('Error con el Login');
      });
  }

}
