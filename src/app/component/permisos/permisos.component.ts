import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PermisosService } from '../../services/permisos/permisos.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [SpinnerComponent,
    FormsModule,
    NgbPaginationModule,
    CommonModule],
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.scss'
})
export class PermisosComponent implements OnInit {

  permisos: Permiso[] = [];
  permisosModal: Permiso = new Permiso();
  permisoDeleteModal: Permiso = new Permiso();
  cargar: boolean = false;
  isEdit: boolean = false;

  collectionSize: number = 0;
  page = 1;
  pageSize = 5;

  constructor(
    private modalService: NgbModal,
    private permisosService: PermisosService
  ) { }

  ngOnInit(): void {
    this.loadCargarPermisos();
  }

  private loadCargarPermisos(): void {
    console.log('Cargando loadCargarPermisos');
    this.cargar = true;
    this.permisosService.obtenerPermisos().subscribe(
      (data: any) => {
        if (data.code === '0' && data.data != null) {
          this.permisos = [];
          this.permisos.push(...data.data);
          this.collectionSize = this.permisos.length;
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

  public agregaPermisosModal(content: any): void {
    console.log('Method agregarRolModal.');
    this.permisosModal = new Permiso();
    this.permisosModal.estado = true;
    this.isEdit = false;
    this.openModalFunction(content);
  }

  public editarPermisosModal(content: any, permisosSelected: Permiso): void {
    console.log('Method editarUserModal');
    this.permisosModal = permisosSelected;
    this.isEdit = true;
    this.openModalFunction(content);
  }

  public deletePermisosModal(content: any, permisosSelected: Permiso): void {
    console.log('Method deleteUserModal');
    this.permisosModal = permisosSelected;
    this.openModalFunction(content);
  }

  public addPermisosModal(content: any, index: number): void {
    this.permisos[index].addPermiso = !this.permisos[index].addPermiso;
    console.log('Method agregarUser.');
    this.permisosModal = new Permiso();
    this.permisosModal.estado = true;
    this.openModalFunction(content);
  }

  private openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  public agregarPermisosModal(content: any): void {
    console.log('Method agregarPermisosModal.');
    this.permisosModal = new Permiso();
    this.permisosModal.estado = true;
    this.isEdit = false;
    this.openModalFunction(content);
  }

  public guardarPermiso(): void {
    const ctaUsr = this.permisosModal.name.trim();
    const ctaEmail = this.permisosModal.descrip.trim();
    if (ctaUsr !== null && typeof ctaUsr !== 'undefined' && ctaUsr !== '' &&
      ctaEmail !== null && typeof ctaEmail !== 'undefined' && ctaEmail !== ''
    ) {
      if (!this.isEdit) {
        this.createNewPermisos();
      } else {
        this.editPermisos();
      }
    } else {
      alert('Nombre o correo Son inválido');
    }
  }

  private createNewPermisos(): void {
    console.log('Cargando createNewPermisos');
    this.cargar = true;
    this.permisosService.newUser(this.permisosModal.name, this.permisosModal.descrip, this.permisosModal.code, this.permisosModal.estado).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargarPermisos();
        } else {
          console.log('Error con la respuesta de servicios de Usuaios');
          alert('Error con la respuesta de servicios de Usuaios');
        }
        this.cargar = false;
      },
      (err: any) => {
        //this.error.mostrarError('Error con el servicio de Usuaios');
        this.closeModal();
        console.log('Error con el servicio de Usuaios');
        alert('Error con el servicio de Usuaios');
        this.cargar = false;
      });
  }

  private editPermisos(): void {
    console.log('Cargando editPermisos');
    this.cargar = true;
    this.permisosService.updatePermisos(
      this.permisosModal.id,
      this.permisosModal.name,
      this.permisosModal.descrip,
      this.permisosModal.code,
      this.permisosModal.estado
    ).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargarPermisos();
        } else {
          console.log('Error con la respuesta de servicios de Usuaios');
          alert('Error con la respuesta de servicios de Usuaios');
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

  public deletePermisos(): void {
    console.log('Cargando editPermisos');
    this.cargar = true;
    this.permisosService.deleteUser(this.permisosModal.id).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargarPermisos();
        } else {
          console.log('Error con la respuesta de servicios de Usuaios');
          alert('Error con la respuesta de servicios de Usuaios');
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
export interface Permiso {
  id: number;
  name: string;
  descrip: string;
  code: string;
  estado: boolean;
  addPermiso: boolean;
}
export class Permiso { }