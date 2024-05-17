import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles/roles.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [SpinnerComponent, FormsModule, NgbPaginationModule, CommonModule, JsonPipe],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  roles: Role[] = [];
  cargar: boolean = false;
  RolTemplate: Rol = {
    id: 0,
    name: '',
    descrip: '',
    estado: false
  };

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

  public agregarRol(content: any): void {
    console.log('Method agregarRol.');
    this.openModalFunction(content);
  }

  public loadRoles() { }
  public trackById() { }
  public openModal() { }
  public guardarRol() { }

  private openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }
}

interface Rol {
  id: number;
  name: string;
  descrip: string;
  estado: boolean;
}

export interface Role {
  id: number;
  name: string;
  descrip: string;
  estado: boolean;
}