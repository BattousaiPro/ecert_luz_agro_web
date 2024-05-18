import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    JsonPipe,
    SpinnerComponent,
    FormsModule,
    NgbPaginationModule,
    CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

  usuarios: Usuario[] = [];
  userModal: Usuario = new Usuario();
  cargar: boolean = false;
  isEdit: boolean = false;

  collectionSize: number = 0;
  page = 1;
  pageSize = 5;

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
          this.collectionSize = this.usuarios.length;
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

  public agregarUserModal(content: any): void {
    console.log('Method agregarUser.');
    this.userModal = new Usuario();
    this.userModal.estado = true;
    this.isEdit = false;
    this.openModalFunction(content);
  }

  public editarUserModal(content: any, userSelected: Usuario): void {
    console.log('Method agregarUser.');
    this.userModal = userSelected;
    this.isEdit = true;
    this.openModalFunction(content);
  }

  public addRolModal(content: any, index: number): void {
    this.usuarios[index].addRol = !this.usuarios[index].addRol;
    console.log('Method agregarUser.');
    this.userModal = new Usuario();
    this.userModal.estado = true;
    //this.openModalFunction(content);
  }

  openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  public guardarUser(): void {
    const ctaUsr = this.userModal.ctaUsr;
    const ctaEmail = this.userModal.ctaEmail;

    if (ctaUsr?.trim() && /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(ctaUsr?.trim())
      && ctaEmail?.trim() && /^[A-Za-zÁÉÍÓÚáéíóúÑñ.@ ]+$/.test(ctaEmail?.trim())
    ) {
      alert('Nombre y correo Son válido');
    } else {
      alert('Nombre o correo Son inválido');
    }
  }

}
export interface Usuario {
  id: number;
  ctaUsr: string;
  ctaPass: string;
  ctaEmail: string;
  //tipUsr: number;
  //estImp: number;
  //estCop: number;
  //estCar: number;
  //chkRut: number;
  //estCed: number;
  estado: boolean;
  addRol: boolean;
}
export class Usuario { }
