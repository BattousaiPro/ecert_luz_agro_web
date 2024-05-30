import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from '../../utils/modalOptions';
import { UsuariosRequest } from './model/UsuariosRequest';
import { Role } from '../roles/roles.component';
import { RolesService } from '../../services/roles/roles.service';

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

  roles: Role[] = [];
  usuarios: Usuario[] = [];
  userModal: Usuario = new Usuario();
  userDeleteModal: Usuario = new Usuario();
  req: UsuariosRequest = new UsuariosRequest();

  cargar: boolean = false;
  isEdit: boolean = false;
  modals = new ModalOptions();
  collectionSize: number = 0;

  passConfirm: string = '';

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private rolesService: RolesService,
  ) { }

  ngOnInit(): void {
    this.loadCargar();
    this.loadRoles();
  }

  public loadCargar(): void {
    console.log('Cargando loadCargar');
    this.cargar = true;
    this.userService.obtenerByFilter(this.req).subscribe(
      (data: any) => {
        if (data.code === '0'
          && data.data != null
          && data.data.results != null) {
          this.closeModal();
          this.usuarios = [];
          this.usuarios.push(...data.data.results);
          this.collectionSize = data.data.totalReg;
        } else {
          this.modals.info('Algo paso con la obtención de los Usuarios');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de Usuaios');
        this.cargar = false;
      });
  }

  public loadRoles(): void {
    console.log('Cargando loadRoles');
    this.cargar = true;
    this.rolesService.getAll().subscribe(
      (data: any) => {
        if (data.code === '0'
          && data.data != null
          && data.data.results != null) {
          this.closeModal();
          this.roles = [];
          this.roles.push(...data.data.results);
        } else {
          this.modals.info('Algo paso con la obtención de los Roles');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de Roles');
        this.cargar = false;
      });
  }

  public agregaModal(content: any): void {
    console.log('Method agregaModal.');
    this.userModal = new Usuario();
    this.userModal.estado = true;
    this.isEdit = false;
    this.openModalFunction(content);
  }

  public editarModal(content: any, userSelected: Usuario): void {
    console.log('Method editarModal');
    this.userModal = userSelected;
    this.isEdit = true;
    this.openModalFunction(content);
  }

  public deleteModal(content: any, userSelected: Usuario): void {
    console.log('Method deleteModal');
    this.userDeleteModal = userSelected;
    this.openModalFunction(content);
  }

  public addModal(content: any, index: number): void {
    this.usuarios[index].addUser = !this.usuarios[index].addUser;
    console.log('Method agregarUser.');
    this.userModal = new Usuario();
    this.userModal.estado = true;
    this.openModalFunction(content);
  }

  public setRoles(index: number): void {
    this.modals.info('Funcionalidad No disponible');
  }

  private openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  public guardar(): void {
    if (this.validateField()) {
      if (!this.isEdit) {
        this.createNew();
      } else {
        this.edit();
      }
    } else {
      this.modals.info('Nombre o correo Son inválido');
    }
  }

  private validateField(): boolean {
    if (!this.isEdit) {
      const ctaUsr = this.userModal.ctaUserName.trim();
      const ctaEmail = this.userModal.ctaEmail.trim();
      if (ctaUsr !== null && typeof ctaUsr !== 'undefined' && ctaUsr !== ''
        && ctaEmail !== null && typeof ctaEmail !== 'undefined' && ctaEmail !== '') {
        if (this.validatPassWord()) {
          return true;
        }
      }
    } else {
      return true;
    }
    return false;
  }

  private validatPassWord(): boolean {
    const ctaPass = this.userModal.ctaPassWord.trim();
    this.passConfirm
    if (ctaPass !== null && typeof ctaPass !== 'undefined' && ctaPass !== ''
      && this.passConfirm !== null && typeof this.passConfirm !== 'undefined' && this.passConfirm !== '') {
      if (ctaPass === this.passConfirm) {
        return true;
      }
    }
    return false;
  }

  private createNew(): void {
    console.log('Cargando createNew');
    this.cargar = true;
    this.userService.new(
      this.userModal.ctaUserName,
      this.userModal.ctaPassWord,
      this.userModal.ctaEmail
    ).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargar();
        } else if (data.code === '-2') {
          this.modals.warning(data.message);
        } else {
          this.modals.error('Error con la respuesta de servicios para crear Usuarios');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de crear Usuarios');
        this.cargar = false;
      });
  }

  private edit(): void {
    console.log('Cargando edit');
    this.cargar = true;
    this.userService.update(
      this.userModal.id,
      this.userModal.ctaUserName,
      this.userModal.ctaPassWord,
      this.userModal.ctaEmail,
      this.userModal.estado
    ).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de actualizar Usuaios');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de actualizar Usuaios');
        this.cargar = false;
      });
  }

  public delete(): void {
    console.log('Cargando edit');
    this.cargar = true;
    this.userService.delete(this.userDeleteModal.id).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de eliminar Usuaios');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de eliminar Usuaios');
        this.cargar = false;
      });
  }

  public closeModal() {
    this.modalService.dismissAll();
  }

  public deleteRoles(content: any, roleSelected: Role): void {
    console.log('Method deleteRoles');
    this.modals.info('Funcionalidad No disponible');
  }

  public agregarRoles(index: number): void {
    console.log('Method agregarRoles');
    this.modals.info('Funcionalidad No disponible');
  }

  public guardarRoles(): void {
    console.log('Method guardarRoles');
    this.modals.info('Funcionalidad No disponible');
  }

}

export interface Usuario {
  id: number;
  ctaUserName: string;
  ctaPassWord: string;
  ctaEmail: string;
  estado: boolean;
  addUser: boolean;
  addRol: boolean;
}
export class Usuario {
  constructor() {
    this.ctaUserName = '';
    this.ctaEmail = '';
    this.ctaEmail = '';
    this.addRol = false;
  }
}
