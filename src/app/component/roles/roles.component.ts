import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles/roles.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ModalOptions } from '../../utils/modalOptions';
import { Permiso } from '../permisos/permisos.component';
import { PermisosService } from '../../services/permisos/permisos.service';
import { RolesRequest } from './model/RolesRequest';

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
  permisos: Permiso[] = [];
  rolModal: Role = new Role();
  rolDeleteModal: Role = new Role();
  req: RolesRequest = new RolesRequest();

  cargar: boolean = false;
  isEdit: boolean = false;
  modals = new ModalOptions();
  collectionSize: number = 0;

  constructor(
    private modalService: NgbModal,
    private rolesService: RolesService,
    private permisosService: PermisosService
  ) { }

  ngOnInit(): void {
    this.loadCargar();
    this.loadPermisos();
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
        } else {
          this.modals.success('Error con la respuesta de servicios de Roles');
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
          this.permisos = [];
          this.permisos.push(...data.data);
        } else {
          this.modals.success('Error con la respuesta de servicios de Permisos');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.modals.error('Error con el servicio de Permisos');
        this.cargar = false;
      }
    );
  }

  public agregaModal(content: any): void {
    console.log('Method agregaModal.');
    this.rolModal = new Role();
    this.rolModal.estado = true;
    this.isEdit = false;
    this.openModalFunction(content);
  }

  public editarModal(content: any, rolesSelected: Role): void {
    console.log('Method editarModal.');
    this.rolModal = rolesSelected;
    this.isEdit = true;
    this.openModalFunction(content);
  }

  public deleteModal(content: any, roleSelected: Role): void {
    console.log('Method deleteesModal');
    this.rolDeleteModal = roleSelected;
    this.openModalFunction(content);
  }

  public deletePermiso(content: any, roleSelected: Role): void {
    console.log('Method deletePermiso');
    this.modals.info('Funcionalidad No disponible');
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
    const name = this.rolModal.name.trim();
    const descrip = this.rolModal.descrip.trim();
    const code = this.rolModal.code.trim();
    if (name !== null && typeof name !== 'undefined' && name !== ''
      && descrip !== null && typeof descrip !== 'undefined' && descrip !== ''
      && code !== null && typeof code !== 'undefined' && code !== ''
    ) {
      if (!this.isEdit) {
        this.createNew();
      } else {
        this.edit();
      }
    } else {
      this.modals.info('Nombre o Descripción o Código Son inválido');
    }
  }

  private createNew(): void {
    console.log('Cargando createNewUser');
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
          this.modals.error('Error con la respuesta de servicios de Roles para crear');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de Roles para crear');
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
          this.modals.error('Error con la respuesta de servicios de Roles para actualizar');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de Roles para actualizar');
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
          this.modals.error('Error con la respuesta de servicios de Roles para eliminar');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de Roles para eliminar');
        this.cargar = false;
      });
  }

  public closeModal() {
    this.modalService.dismissAll();
  }

  public agregarPermiso(index: number): void {
    console.log('Method agregarPermiso');
    this.modals.info('Funcionalidad No disponible');
  }

  public guardarPermisos(): void {
    console.log('Method guardarPermisos');
    this.modals.info('Funcionalidad No disponible');
  }

}

export interface Role {
  id: number;
  name: string;
  descrip: string;
  code: string;
  estado: boolean;
  addRol: boolean;
  addPermisos: boolean;

}
export class Role {
  constructor() {
    this.name = '';
    this.descrip = '';
    this.code = '';
    this.addPermisos = false;
  }
}
