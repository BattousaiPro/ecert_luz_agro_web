import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles/roles.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [SpinnerComponent, FormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {

  roles: Role[] = [];
  cargar: boolean = false;
  RolTemplate: RolTemplate = {
    ctaEmail: '',
    estado: false,
    contrasena: '',
    confirmContrasena: '',
    ctaUsr: ''
  };

  constructor(private modalService: NgbModal,
    private rolesService: RolesService) { }

  ngOnInit(): void {
    this.loadCargarRoles();
  }

  private loadCargarRoles(): void {
    console.log('Cargando loadCargarRoles');
    this.cargar = true;
    this.rolesService.obtenerRoles().subscribe(
      (data: any) => {
        // console.log(JSON.stringify(data));
        if (data.code === '0' && data.data != null) {
          this.roles.push(...data.data);
          // console.log(JSON.stringify(this.roles));
        } else {
          //this.error.mostrarError('Error con la respuesta de servicios de Roles');
          console.log('Error con la respuesta de servicios de Roles');
          alert('Error con la respuesta de servicios de Roles');
        }
        this.cargar = false;
      },
      (err: any) => {
        //this.error.mostrarError('Error con el ervicio de Roles');
        console.log('Error con el ervicio de Roles');
        alert('Error con el ervicio de Roles');
        this.cargar = false;
      });
  }

  public agregarRol(content: any): void {
    console.log('Method agregarRol.');
    this.openModalFunction(content);
    
  }
  loadRoles() { }
  trackById() { }
  openModal() { }
  guardarRol() { }

  openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }
  @Component({
    selector: 'app-agregar-rol',
    templateUrl: './agregar-rol.component.html',
    styleUrls: ['./agregar-rol.component.css']
  })

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  cargar = false;
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
