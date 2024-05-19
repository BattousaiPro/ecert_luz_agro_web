import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles/roles.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ModalOptions } from '../../utils/modalOptions';

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
  rolModal: Role = new Role();
  rolDeleteModal: Role = new Role();
  cargar: boolean = false;
  isEdit: boolean = false;
  modals = new ModalOptions();

  collectionSize: number = 0;
  page = 1;
  pageSize = 5;

  constructor(
    private modalService: NgbModal,
    private rolesService: RolesService
  ) { }

  ngOnInit(): void {
    this.loadCargarRoles();
  }

  private loadCargarRoles(): void {
    console.log('Cargando loadCargarRoles');
    this.cargar = true;
    this.rolesService.obtenerRoles().subscribe(
      (data: any) => {
        if (data.code === '0' && data.data != null) {
          this.closeModal();
          this.roles = [];
          this.roles.push(...data.data);
          this.collectionSize = this.roles.length;
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

  public agregarRolModal(content: any): void {
    console.log('Method agregarRolModal.');
    this.rolModal = new Role();
    this.rolModal.estado = true;
    this.isEdit = false;
    this.openModalFunction(content);
  }

  public editarRolModal(content: any, rolesSelected: Role): void {
    console.log('Method editarRolModal.');
    this.rolModal = rolesSelected;
    this.isEdit = true;
    this.openModalFunction(content);
  }

  public deleteRolModal(content: any, roleSelected: Role): void {
    console.log('Method deleteRolesModal');
    this.rolDeleteModal = roleSelected;
    this.openModalFunction(content);
  }

  public addRolModal(content: any, index: number): void {
    this.roles[index].addRol = !this.roles[index].addRol;
    console.log('Method agregarRol.');
    this.rolModal = new Role();
    this.rolModal.estado = true;
    this.openModalFunction(content);
  }

  private openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  public guardarRol(): void {
    const ctaUsr = this.rolModal.name.trim();
    const ctaEmail = this.rolModal.descrip.trim();
    if (ctaUsr !== null && typeof ctaUsr !== 'undefined' && ctaUsr !== '' &&
      ctaEmail !== null && typeof ctaEmail !== 'undefined' && ctaEmail !== ''
    ) {
      if (!this.isEdit) {
        this.createNewRol();
      } else {
        this.editRol();
      }
    } else {
      this.modals.info('Nombre o correo Son inválido');
    }
  }

  private createNewRol(): void {
    console.log('Cargando createNewUser');
    this.cargar = true;
    this.rolesService.newRol(this.rolModal.name, this.rolModal.descrip).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargarRoles();
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

  private editRol(): void {
    console.log('Cargando editRol');
    this.cargar = true;
    this.rolesService.updateRol(
      this.rolModal.id,
      this.rolModal.name,
      this.rolModal.descrip,
      this.rolModal.estado,
    ).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargarRoles();
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

  public deleteRol(): void {
    console.log('Cargando deleteRol');
    this.cargar = true;
    this.rolesService.deleteRol(this.rolDeleteModal.id).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargarRoles();
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

}

export interface Role {
  id: number;
  name: string;
  descrip: string;
  estado: boolean;
  addRol: boolean;
}
export class Role { }
