import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, JsonPipe, SpinnerComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

  usuarios: Usuario[] = [];
  userUpdate: Usuario = new Usuario();
  cargar: boolean = false;

  constructor(private modalService: NgbModal,
    private userService: UserService) { }

  ngOnInit(): void {
    this.loadCargarUsers();
  }

  private loadCargarUsers(): void {
    console.log('Cargando loadCargarUsers');
    this.cargar = true;
    this.userService.obtenerUser().subscribe(
      (data: any) => {
        // console.log(JSON.stringify(data));
        if (data.code === '0' && data.data != null) {
          this.usuarios.push(...data.data);
          // console.log(JSON.stringify(this.usuarios));
        } else {
          //this.error.mostrarError('Error con la respuesta de servicios de Usuaios');
          console.log('Error con la respuesta de servicios de Usuaios');
          alert('Error con la respuesta de servicios de Usuaios');
        }
        this.cargar = false;
      },
      (err: any) => {
        //this.error.mostrarError('Error con el ervicio de Usuaios');
        console.log('Error con el ervicio de Usuaios');
        alert('Error con el ervicio de Usuaios');
        this.cargar = false;
      });
  }

  public agregarUser(content: any): void {
    console.log('Method agregarUser.');
    this.openModalFunction(content);
  }

  openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

}
export interface Usuario {
  id: number;
  nombre: string;
  ape_pat: string;
  ape_mat: string;
  email: string;
  pass: string;
  ctaUsr: string;
  ctaEmail: string;
  estado: boolean;
}
export class Usuario { }