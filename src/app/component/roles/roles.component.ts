import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles/roles.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

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
  cargar: boolean = false;
  isEdit: boolean = false;

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
          this.roles.push(...data.data);
          this.collectionSize = this.roles.length;
        } else {
          console.log('Error con la respuesta de servicios de Roles');
          alert('Error con la respuesta de servicios de Roles');
        }
        this.cargar = false;
      },
      (err: any) => {
        console.log('Error con el servicio de Roles');
        alert('Error con el servicio de Roles');
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

  private createNewRoles(): void {
    console.log('Cargando createNewUser');
    this.cargar = true;

    this.rolesService.newRoles(this.rolModal.id, this.rolModal.name, this.rolModal.descrip , this.rolModal.estado).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargarRoles();
        } else {
          console.log('Error con la respuesta de servicios de Roles');
          alert('Error con la respuesta de servicios de Roles');
        }
        this.cargar = false;
      },
      (err: any) => {
        //this.error.mostrarError('Error con el servicio de Usuaios');
        this.closeModal();
        console.log('Error con el servicio de Roles');
        alert('Error con el servicio de Roles');
        this.cargar = false;
      });
  }
  private editRoles(): void {
    console.log('Cargando editRoles');
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
          console.log('Error con la respuesta de servicios de Roles');
          alert('Error con la respuesta de servicios de Roles');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        //this.error.mostrarError('Error con el servicio de Roles');
        console.log('Error con el servicio de Roles');
        alert('Error con el servicio de Roles');
        this.cargar = false;
      });
  }

  public deleteRol(): void {
    console.log('Cargando editRoles');
    this.cargar = true;
    this.rolesService.deleteRol(this.rolDeleteModal.id).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargarRoles();
        } else {
          console.log('Error con la respuesta de servicios de Roles');
          alert('Error con la respuesta de servicios de Roles');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        //this.error.mostrarError('Error con el servicio de Usuaios');
        console.log('Error con el servicio de Usuaios');
        alert('Error con el servicio de Usuaios');
        this.cargar = false;
      });
  }

  public closeModal() {
    this.modalService.dismissAll();
  }

}

export interface Role {
  id?: number;
  name?: string;
  descrip?: string;
  estado?: boolean;
  addRol: boolean;
}
export class Role { }
