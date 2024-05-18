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
  userDeleteModal: Usuario = new Usuario();
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
        if (data.code === '0' && data.data != null) {
          this.modalService.dismissAll();
          this.usuarios.push(...data.data);
          this.collectionSize = this.usuarios.length;
        } else {
          console.log('Error con la respuesta de servicios de Usuaios');
          alert('Error con la respuesta de servicios de Usuaios');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.modalService.dismissAll();
        //this.error.mostrarError('Error con el ervicio de Usuaios');
        console.log('Error con el ervicio de Usuaios');
        alert('Error con el ervicio de Usuaios');
        this.cargar = false;
      });
  }

  public agregarUserModal(content: any): void {
    console.log('Method agregarUserModal.');
    this.userModal = new Usuario();
    this.userModal.estado = true;
    this.isEdit = false;
    this.openModalFunction(content);
  }

  public editarUserModal(content: any, userSelected: Usuario): void {
    console.log('Method editarUserModal');
    this.userModal = userSelected;
    this.isEdit = true;
    this.openModalFunction(content);
  }

  public deleteUserModal(content: any, userSelected: Usuario): void {
    console.log('Method editarUserModal');
    this.userModal = userSelected;
    this.isEdit = true;
    this.openModalFunction(content);
  }

  public addRolModal(content: any, index: number): void {
    this.usuarios[index].addRol = !this.usuarios[index].addRol;
    console.log('Method agregarUser.');
    this.userModal = new Usuario();
    this.userModal.estado = true;
    this.openModalFunction(content);
  }

  private openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  public guardarUser(): void {
    const ctaUsr = this.userModal.ctaUsr.trim();
    const ctaEmail = this.userModal.ctaEmail.trim();
    if (ctaUsr !== null && typeof ctaUsr !== 'undefined' && ctaUsr !== '' &&
      ctaEmail !== null && typeof ctaEmail !== 'undefined' && ctaEmail !== ''
    ) {
      if (!this.isEdit) {
        this.createNewUser();
      } else {
        this.editUser();
      }
    } else {
      alert('Nombre o correo Son inválido');
    }
  }

  private createNewUser(): void {
    console.log('Cargando createNewUser');
    this.cargar = true;
    this.userService.newUser(this.userModal.ctaUsr, this.userModal.ctaPass, this.userModal.ctaEmail).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.modalService.dismissAll();
          this.loadCargarUsers();
        } else {
          console.log('Error con la respuesta de servicios de Usuaios');
          alert('Error con la respuesta de servicios de Usuaios');
        }
        this.cargar = false;
      },
      (err: any) => {
        //this.error.mostrarError('Error con el ervicio de Usuaios');
        this.modalService.dismissAll();
        console.log('Error con el ervicio de Usuaios');
        alert('Error con el ervicio de Usuaios');
        this.cargar = false;
      });
  }

  private editUser(): void {
    console.log('Cargando editUser');
    this.cargar = true;
    this.userService.updateUser(
      this.userModal.id,
      this.userModal.ctaUsr, 
      this.userModal.ctaPass, 
      this.userModal.ctaEmail,
      this.userModal.estado
    ).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.modalService.dismissAll();
          this.loadCargarUsers();
        } else {
          console.log('Error con la respuesta de servicios de Usuaios');
          alert('Error con la respuesta de servicios de Usuaios');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.modalService.dismissAll();
        //this.error.mostrarError('Error con el ervicio de Usuaios');
        console.log('Error con el ervicio de Usuaios');
        alert('Error con el ervicio de Usuaios');
        this.cargar = false;
      });
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
