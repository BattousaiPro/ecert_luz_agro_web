import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { SpinnerComponent } from '../../utilitarios/spinner/spinner.component';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from '../../../utils/modalOptions';
import { UsuariosRequest } from './model/UsuariosRequest';
import { Role } from '../roles/roles.component';
import { RolesService } from '../../../services/roles/roles.service';
import { UserRolService } from '../../../services/user-rol/user-rol.service';


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
  //roles: Role[] = [];
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
    private userRolService: UserRolService,
  ) { }

  ngOnInit(): void {
    this.loadCargar();
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
          for (let index = 0; index < this.usuarios.length; index++) {
            this.usuarios[index].idSelectedRol = '';
          }
          this.loadRoles();
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
          && data.data != null) {
          this.closeModal();
          //this.roles = [];
          //this.roles.push(...data.data);
          this.setOptionValidate(data.data);
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

  private setOptionValidate(data: Role[]): void {
    for (let index = 0; index < this.usuarios.length; index++) {
      const rolesList: Role[] = JSON.parse(JSON.stringify(data));
      this.usuarios[index].rolesDisponibeles = [];
      this.usuarios[index].rolesDisponibeles.push(...rolesList);
    }
    for (let index = 0; index < this.usuarios.length; index++) {
      for (let index2 = 0; index2 < this.usuarios[index].rolesDisponibeles.length; index2++) {
        this.usuarios[index].rolesDisponibeles[index2].showAtributeOption = true;
      }
    }
    for (let indexUser = 0; indexUser < this.usuarios.length; indexUser++) {
      for (let indexRolDisp = 0; indexRolDisp < this.usuarios[indexUser].rolesDisponibeles.length; indexRolDisp++) {
        for (let index = 0; index < this.usuarios[indexUser].roles.length; index++) {
          if (this.usuarios[indexUser].roles[index].id === this.usuarios[indexUser].rolesDisponibeles[indexRolDisp].id) {
            this.usuarios[indexUser].rolesDisponibeles[indexRolDisp].showAtributeOption = false;
            break;
          }
        }
      }
    }
  }

  public agregaModal(content: any): void {
    console.log('Method agregaModal.');
    this.userModal = new Usuario();
    this.userModal.estado = true;
    this.isEdit = false;
    this.openModalFunction(content);
  }

  public editarModal(content: any, selectedItem: Usuario): void {
    console.log('Method editarModal');
    this.userModal = JSON.parse(JSON.stringify(selectedItem));
    this.isEdit = true;
    this.openModalFunction(content);
  }

  public deleteModal(content: any, selectedItem: Usuario): void {
    console.log('Method deleteModal');
    this.userDeleteModal = JSON.parse(JSON.stringify(selectedItem));
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
    for (let indexUser = 0; indexUser < this.usuarios.length; indexUser++) {
      if (indexUser !== index) {
        this.usuarios[indexUser].addRol = false;
        this.usuarios[indexUser].addUser = false;
      }
    }
    this.usuarios[index].addRol = !this.usuarios[index].addRol;
    this.usuarios[index].addUser = !this.usuarios[index].addUser;
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

  public deleteRoles(userId: number, roleId: number): void {
    console.log('Method deleteRoles');
    for (let index = 0; index < this.usuarios.length; index++) {
      if (userId === this.usuarios[index].id) {
        this.usuarios[index].idSelectedRol = '' + roleId;
        break;
      }
    }
    for (let index = 0; index < this.usuarios.length; index++) {
      for (let index2 = 0; index2 < this.usuarios[index].rolesDisponibeles.length; index2++) {
        if (userId === this.usuarios[index].id) {
          if (this.usuarios[index].rolesDisponibeles[index2].id === +this.usuarios[index].idSelectedRol) {
            this.usuarios[index].rolesDisponibeles[index2].showAtributeOption = !this.usuarios[index].rolesDisponibeles[index2].showAtributeOption;
          }
        }
      }
    }
    setTimeout(() => {
      for (let index = 0; index < this.usuarios.length; index++) {
        if (userId === this.usuarios[index].id) {
          this.usuarios[index].idSelectedRol = '';
          break;
        }
      }
    }, 10);
  }

  public guardarRoles(): void {
    console.log('Method guardarRoles');
    this.modals.info('Funcionalidad No disponible');
  }

  public onChange(event: string, userId: number): void {
    for (let index = 0; index < this.usuarios.length; index++) {
      if (userId === this.usuarios[index].id) {
        this.usuarios[index].idSelectedRol = event;
        break;
      }
    }
    for (let index = 0; index < this.usuarios.length; index++) {
      for (let index2 = 0; index2 < this.usuarios[index].rolesDisponibeles.length; index2++) {
        if (userId === this.usuarios[index].id) {
          if (this.usuarios[index].rolesDisponibeles[index2].id === +this.usuarios[index].idSelectedRol) {
            this.usuarios[index].rolesDisponibeles[index2].showAtributeOption = !this.usuarios[index].rolesDisponibeles[index2].showAtributeOption;
          }
        }
      }
    }
    setTimeout(() => {
      for (let index = 0; index < this.usuarios.length; index++) {
        if (userId === this.usuarios[index].id) {
          this.usuarios[index].idSelectedRol = '';
          break;
        }
      }
    }, 10);
  }
}

export interface Usuario {
  id: number;
  ctaUserName: string;
  ctaPassWord: string;
  ctaEmail: string;
  estado: boolean;
  roles: Role[];
  rolesDisponibeles: Role[];
  addUser: boolean;
  addRol: boolean;

  idSelectedRol: string;
}
export class Usuario {
  constructor() {
    this.ctaUserName = '';
    this.ctaEmail = '';
    this.ctaEmail = '';
    this.addRol = false;
    this.rolesDisponibeles = [];
    this.idSelectedRol = '';
  }
}
