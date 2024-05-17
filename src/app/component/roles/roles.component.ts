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
  cargar: boolean = false;
  rolModal: Role = new Role();

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

  public agregarRol(content: any, rol: Role = {}): void {
    console.log('Method agregarRol.');
    rol = {
      name: '',
      descrip: '',
      estado: true
    };
    this.rolModal = rol;
    this.openModalFunction(content);
  }

  public agregarRolModal(content: any): void {
    console.log('Method agregarRolModal.');
    this.openModalFunction(content);
  }

  private openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }



  public guardarRol(): void {
    const name = this.rolModal.name;
    if (name && /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(name)) {
      console.log(name);
      alert('Nombre válido');
    } else {
      alert('Nombre inválido');
    }
  }

}

export interface Role {
  id?: number;
  name?: string;
  descrip?: string;
  estado?: boolean;
}
export class Role { }
