import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../../services/roles/roles.service';
import { SpinnerComponent } from '../../utilitarios/spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ModalOptions } from '../../../utils/modalOptions';
import { Permiso } from '../permisos/permisos.component';
import { PermisosService } from '../../../services/permisos/permisos.service';
import { RolesRequest } from './model/RolesRequest';
import { RolPermisoService } from '../../../services/rol-permiso/rol-permiso.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    SpinnerComponent,
    FormsModule,
    NgbPaginationModule,
    CommonModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {

  roles: Role[] = [];
  //permisos: Permiso[] = [];
  rolModal: Role = new Role();
  rolDeleteModal: Role = new Role();
  req: RolesRequest = new RolesRequest();

  cargar: boolean = false;
  isEdit: boolean = false;
  modals = new ModalOptions();
  collectionSize: number = 0;

  erroresList: string[] = [];
  isErroresList: boolean = false;

  constructor(
    private modalService: NgbModal,
    private rolesService: RolesService,
    private permisosService: PermisosService,
    private rolPermisoService: RolPermisoService,
  ) { }

  ngOnInit(): void {
    this.loadCargar();
  }

  public loadCargar(): void {
    console.log('Cargando loadCargar');
    this.cargar = true;
    this.rolesService.obtenerByFilter(this.req).subscribe(
      (data: any) => {
        if (data.code === '0'
          && data.data != null
          && data.data.results != null) {
          this.closeModal();
          this.roles = [];
          this.roles.push(...data.data.results);
          this.collectionSize = data.data.totalReg;
          for (let index = 0; index < this.roles.length; index++) {
            this.roles[index].idSelectedPermiso = '';
          }
          this.loadPermisos();
        } else {
          this.modals.info('Algo paso con la obtención de los Roles');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.modals.error('Error con el servicio de Roles');
        this.cargar = false;
      }
    );
  }

  private loadPermisos(): void {
    console.log('Cargando loadPermisos');
    this.cargar = true;
    this.permisosService.getAll().subscribe(
      (data: any) => {
        if (data.code === '0' && data.data != null) {
          this.closeModal();
          //this.permisos = [];
          //this.permisos.push(...data.data);
          this.setOptionValidate(data.data);
        } else {
          this.modals.info('Algo paso con la obtención de los Permisos');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.modals.error('Error con el servicio de Permisos');
        this.cargar = false;
      }
    );
  }

  private setOptionValidate(data: Permiso[]): void {
    for (let index = 0; index < this.roles.length; index++) {
      const permisosList: Permiso[] = JSON.parse(JSON.stringify(data));
      this.roles[index].permisosDisponibeles = [];
      this.roles[index].permisosDisponibeles.push(...permisosList);
    }
    for (let index = 0; index < this.roles.length; index++) {
      for (let index2 = 0; index2 < this.roles[index].permisosDisponibeles.length; index2++) {
        this.roles[index].permisosDisponibeles[index2].showAtributeOption = true;
      }
    }
    for (let indexRol = 0; indexRol < this.roles.length; indexRol++) {
      for (let indexPerDisp = 0; indexPerDisp < this.roles[indexRol].permisosDisponibeles.length; indexPerDisp++) {
        for (let index = 0; index < this.roles[indexRol].permisos.length; index++) {
          if (this.roles[indexRol].permisos[index].id === this.roles[indexRol].permisosDisponibeles[indexPerDisp].id) {
            this.roles[indexRol].permisosDisponibeles[indexPerDisp].showAtributeOption = false;
            break;
          }
        }
      }
    }
  }

  public agregaModal(content: any): void {
    console.log('Method agregaModal.');
    this.rolModal = new Role();
    this.rolModal.estado = true;
    this.isEdit = false;
    this.isErroresList = false;
    this.openModalFunction(content);
  }

  public editarModal(content: any, selectedItem: Role): void {
    console.log('Method editarModal.');
    this.rolModal = JSON.parse(JSON.stringify(selectedItem));
    this.isEdit = true;
    this.openModalFunction(content);
  }

  public deleteModal(content: any, selectedItem: Role): void {
    console.log('Method deleteesModal');
    this.rolDeleteModal = JSON.parse(JSON.stringify(selectedItem));
    this.openModalFunction(content);
  }

  public addModal(content: any, index: number): void {
    this.roles[index].addRol = !this.roles[index].addRol;
    console.log('Method agregarRol.');
    this.rolModal = new Role();
    this.rolModal.estado = true;
    this.openModalFunction(content);
  }

  public setPermisos(index: number): void {
    for (let indexRol = 0; indexRol < this.roles.length; indexRol++) {
      if (indexRol !== index) {
        this.roles[indexRol].addPermisos = false;
        this.roles[indexRol].addRol = false;
      }
    }
    this.roles[index].addPermisos = !this.roles[index].addPermisos;
    this.roles[index].addRol = !this.roles[index].addRol;
  }

  private openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  public guardar(): void {
    this.erroresList = [];
    this.isErroresList = false;
    this.erroresList = this.validateNew();
    if (!this.isEdit) {
      if (this.erroresList.length > 0) {
        this.setIsErroresList(true);
      } else {
        // console.log('this.new()');
        this.new();
      }
    } else {
      if (this.erroresList.length > 0) {
        this.setIsErroresList(false);
      } else {
        // console.log('this.edit()');
        this.edit();
      }
    }
    /*
    const name = this.rolModal.name.trim();
    const descrip = this.rolModal.descrip.trim();
    const code = this.rolModal.code.trim();
    if (name !== null && typeof name !== 'undefined' && name !== ''
      && descrip !== null && typeof descrip !== 'undefined' && descrip !== ''
      && code !== null && typeof code !== 'undefined' && code !== ''
    ) {
      if (!this.isEdit) {
        this.new();
      } else {
        this.edit();
      }
    } else {
      this.modals.info('Nombre o Descripción o Código Son inválido');
    }*/
  }

  private setIsErroresList(isErroresList: boolean): void {
    /*
    for (let index = 0; index < this.erroresList.length; index++) {
      const element = this.erroresList[index];
      console.log('[' + index + ']: ' + element);
    }
    */
    this.isErroresList = isErroresList;
  }

  private validateNew(): string[] {
    let errores: string[] = [];
    this.rolModal.name = this.rolModal.name.trim();
    if (this.rolModal.name === null || typeof this.rolModal.name === 'undefined' || this.rolModal.name === '') {
      errores.push('Nombre es Obligatorio');
    }

    this.rolModal.descrip = this.rolModal.descrip.trim();
    if (this.rolModal.descrip === null || typeof this.rolModal.descrip === 'undefined' || this.rolModal.descrip === '') {
      errores.push('Descripción es Obligatorio');
    }

    this.rolModal.code = this.rolModal.code.trim();
    if (this.rolModal.code === null || typeof this.rolModal.code === 'undefined' || this.rolModal.code === '') {
      errores.push('Código es Obligatorio');
    }
    return errores;
  }

  private new(): void {
    console.log('Cargando newUser');
    this.cargar = true;
    this.rolesService.new(
      this.rolModal.name,
      this.rolModal.descrip,
      this.rolModal.code
    ).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargar();
        } else if (data.code === '-2') {
          this.modals.warning(data.message);
        } else {
          this.modals.error('Error con la respuesta de servicios para crear Roles');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de crear Roles');
        this.cargar = false;
      });
  }

  private edit(): void {
    console.log('Cargando edit');
    this.cargar = true;
    this.rolesService.update(
      this.rolModal.id,
      this.rolModal.name,
      this.rolModal.descrip,
      this.rolModal.code,
      this.rolModal.estado,
    ).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de actualizar Roles');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de actualizar Roles');
        this.cargar = false;
      });
  }

  public delete(): void {
    console.log('Cargando delete');
    this.cargar = true;
    this.rolesService.delete(this.rolDeleteModal.id).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de eliminar Roles');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de eliminar Roles');
        this.cargar = false;
      });
  }

  public closeModal() {
    this.modalService.dismissAll();
  }

  public deletePermiso(roleId: number, permisoId: number): void {
    console.log('Method deletePermiso');
    for (let index = 0; index < this.roles.length; index++) {
      if (roleId === this.roles[index].id) {
        this.roles[index].idSelectedPermiso = '' + permisoId;
        break;
      }
    }
    for (let index = 0; index < this.roles.length; index++) {
      for (let index2 = 0; index2 < this.roles[index].permisosDisponibeles.length; index2++) {
        if (roleId === this.roles[index].id) {
          if (this.roles[index].permisosDisponibeles[index2].id === +this.roles[index].idSelectedPermiso) {
            this.roles[index].permisosDisponibeles[index2].showAtributeOption = !this.roles[index].permisosDisponibeles[index2].showAtributeOption;
          }
        }
      }
    }
    setTimeout(() => {
      for (let index = 0; index < this.roles.length; index++) {
        if (roleId === this.roles[index].id) {
          this.roles[index].idSelectedPermiso = '';
          break;
        }
      }
    }, 10);
  }

  public guardarPermisos(rolId: number): void {
    console.log('Method guardarPermisos');
    let permisoIds: number[] = [];
    for (let index = 0; index < this.roles.length; index++) {
      if (rolId === this.roles[index].id) {
        for (let index2 = 0; index2 < this.roles[index].permisosDisponibeles.length; index2++) {
          if (!this.roles[index].permisosDisponibeles[index2].showAtributeOption) {
            permisoIds.push(this.roles[index].permisosDisponibeles[index2].id);
          }
        }
      }
    }
    // console.log('rolIds: ' + JSON.stringify(permisoIds));
    this.cargar = true;
    this.rolPermisoService.setPermisoToRol(rolId, permisoIds).subscribe(
      (data: any) => {
        if (data.code === '0') {
          setTimeout(() => {
            this.loadCargar();
          }, 10);
        } else {
          this.cargar = false;
          this.modals.error('Error con la respuesta de servicios de asignar Permisos');
        }
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de asignar Permisos');
        this.cargar = false;
      });
  }

  public onChange(event: string, userId: number): void {
    for (let index = 0; index < this.roles.length; index++) {
      if (userId === this.roles[index].id) {
        this.roles[index].idSelectedPermiso = event;
        break;
      }
    }
    for (let index = 0; index < this.roles.length; index++) {
      for (let index2 = 0; index2 < this.roles[index].permisosDisponibeles.length; index2++) {
        if (userId === this.roles[index].id) {
          if (this.roles[index].permisosDisponibeles[index2].id === +this.roles[index].idSelectedPermiso) {
            this.roles[index].permisosDisponibeles[index2].showAtributeOption = !this.roles[index].permisosDisponibeles[index2].showAtributeOption;
          }
        }
      }
    }
    setTimeout(() => {
      for (let index = 0; index < this.roles.length; index++) {
        if (userId === this.roles[index].id) {
          this.roles[index].idSelectedPermiso = '';
          break;
        }
      }
    }, 10);
  }

}

export interface Role {
  id: number;
  name: string;
  descrip: string;
  code: string;
  estado: boolean;
  permisos: Permiso[];
  permisosDisponibeles: Permiso[];
  addRol: boolean;
  addPermisos: boolean;

  showAtributeOption: boolean;
  idSelectedPermiso: string;
}
export class Role {
  constructor() {
    this.name = '';
    this.descrip = '';
    this.code = '';
    this.addPermisos = false;

    this.showAtributeOption = true;
    this.idSelectedPermiso = '';
  }
}
