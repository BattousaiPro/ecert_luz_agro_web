import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PermisosService } from '../../services/permisos/permisos.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalOptions } from '../../utils/modalOptions';

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
  modals = new ModalOptions();

  collectionSize: number = 0;
  page = 1;
  pageSize = 5;

  constructor(
    private modalService: NgbModal,
    private permisosService: PermisosService
  ) { }

  ngOnInit(): void {
    this.loadCargar();
  }

  private loadCargar(): void {
    console.log('Cargando loadCargar');
    this.cargar = true;
    this.permisosService.getAll().subscribe(
      (data: any) => {
        if (data.code === '0' && data.data != null) {
          this.closeModal();
          this.permisos = [];
          this.permisos.push(...data.data);
          this.collectionSize = this.permisos.length;
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
    console.log('Method agregarRolModal.');
    this.permisosModal = new Permiso();
    this.permisosModal.estado = true;
    this.isEdit = false;
    this.openModalFunction(content);
  }

  public editarModal(content: any, permisosSelected: Permiso): void {
    console.log('Method editarUserModal');
    this.permisosModal = permisosSelected;
    this.isEdit = true;
    this.openModalFunction(content);
  }

  public deleteModal(content: any, permisosSelected: Permiso): void {
    console.log('Method deleteUserModal');
    this.permisosModal = permisosSelected;
    this.openModalFunction(content);
  }

  public addModal(content: any, index: number): void {
    this.permisos[index].addPermiso = !this.permisos[index].addPermiso;
    console.log('Method agregarUser.');
    this.permisosModal = new Permiso();
    this.permisosModal.estado = true;
    this.openModalFunction(content);
  }

  private openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  public guardar(): void {
    const name = this.permisosModal.name.trim();
    const descrip = this.permisosModal.descrip.trim();
    const code = this.permisosModal.code.trim();
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
    console.log('Cargando createNew');
    this.cargar = true;
    this.permisosService.new(
      this.permisosModal.name,
      this.permisosModal.descrip,
      this.permisosModal.code,
      this.permisosModal.estado
    ).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de Permisos para crear');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de Permisos para crear');
        this.cargar = false;
      });
  }

  private edit(): void {
    console.log('Cargando edit');
    this.cargar = true;
    this.permisosService.update(
      this.permisosModal.id,
      this.permisosModal.name,
      this.permisosModal.descrip,
      this.permisosModal.code,
      this.permisosModal.estado
    ).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de Permisos para actualizar');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de Permisos para actualizar');
        this.cargar = false;
      });
  }

  public delete(): void {
    console.log('Cargando edit');
    this.cargar = true;
    this.permisosService.delete(this.permisosModal.id).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de Permisos para eliminar');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de Permisos para eliminar');
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
export class Permiso {
  constructor() {
    this.name='';
    this.descrip='';
    this.code='';
  }
}