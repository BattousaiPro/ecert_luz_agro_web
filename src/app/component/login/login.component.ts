import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../utilitarios/spinner/spinner.component';
import { ModalOptions } from '../../utils/modalOptions';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, SpinnerComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  formulario: FormGroup;
  cargar: boolean = false;
  isEjeShow: boolean = true;
  modals = new ModalOptions();

  constructor(private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,) {
    this.formulario = this.formBuilder.group({
      username: ['adminCop', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(12)], updateOn: 'blur'
      }],
      password: ['Asd1$G.j5', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)
          //, Validators.pattern("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]$")
        ]
      }]
    });
  }
  public ejePassword(): void {
    this.isEjeShow = !this.isEjeShow;
  }

  validarFormulario() {
    console.log(this.formulario);
    //form.controls.itemRePassword
    if (this.formulario.valid == true) {
      //console.log('Forulario Valido');
      this.login();
    } else {
      // Canaliazar los mensajes error.
      //console.log('Forulario No Valido');
      this.modals.info('Error con lo datos del Formuladio.');
    }
  }

  private login(): void {
    console.log('Cargando loadCargarRoles');
    this.cargar = true;
    localStorage.removeItem('datatoken');
    this.authService.login(this.formulario.controls["username"].value, this.formulario.controls["password"].value).subscribe(
      (data: any) => {
        // console.log(JSON.stringify(data));
        if (data.code === '0') {
          localStorage.setItem('datatoken', JSON.stringify(data.data));
          this.authService.logIn();
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
