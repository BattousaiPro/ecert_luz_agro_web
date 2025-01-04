import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PermisosService } from '../../../services/permisos/permisos.service';
import { SpinnerComponent } from '../../utilitarios/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalOptions } from '../../../utils/modalOptions';
import { Utility } from '../../../utils/utility';
import { PermisoVO, PermisosRequestVO } from '../../../utils/modelsVos';

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

  permisos: PermisoVO[] = [];
  permisosModal: PermisoVO = new PermisoVO();
  permisoDeleteModal: PermisoVO = new PermisoVO();
  req: PermisosRequestVO = new PermisosRequestVO();

  cargar: boolean = false;
  isEdit: boolean = false;
  modals = new ModalOptions();
  collectionSize: number = 0;

  hashMapError = new Map<string, string>();

  public utility = new Utility;
  isPermisoVerLista: boolean = false;
  isPermisoCreate: boolean = false;
  isPermisoDelete: boolean = false;
  isPermisoEdit: boolean = false;

  constructor(
    private modalService: NgbModal,
    private permisosService: PermisosService
  ) { }

  setPermiso(): void {
    this.isPermisoVerLista = this.utility.consultar('LUZ_AGRO_MENU_PERMISO');
    this.isPermisoDelete = this.utility.consultar('LUZ_AGRO_PERMISO_DELETE');
    this.isPermisoEdit = this.utility.consultar('LUZ_AGRO_PERMISO_EDIT');
    this.isPermisoCreate = this.utility.consultar('LUZ_AGRO_PERMISO_CREATE');
  }

  ngOnInit(): void {
    this.setPermiso();
    if (this.isPermisoVerLista)
      this.loadCargar();
  }

  public loadCargar(): void {
    console.log('Cargando loadCargar');
    this.cargar = true;
    this.permisosService.findByFilter(this.req).subscribe(
      (data: any) => {
        if (data.body.code === '0'
          && data.body.data != null
          && data.body.data.results != null) {
          this.closeModal();
          this.permisos = [];
          this.permisos.push(...data.body.data.results);
          this.collectionSize = data.body.data.totalReg;
        } else {
          this.modals.error('Algo paso con la obtención de los Permisos');
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
    this.permisosModal = new PermisoVO();
    this.permisosModal.estado = true;
    this.isEdit = false;
    this.hashMapError.clear();
    this.openModalFunction(content);
  }

  public editarModal(content: any, selectedItem: PermisoVO): void {
    console.log('Method editarUserModal');
    this.permisosModal = JSON.parse(JSON.stringify(selectedItem));
    this.isEdit = true;
    this.hashMapError.clear();
    this.openModalFunction(content);
  }

  public deleteModal(content: any, selectedItem: PermisoVO): void {
    console.log('Method deleteUserModal');
    this.permisosModal = JSON.parse(JSON.stringify(selectedItem));
    this.openModalFunction(content);
  }

  private openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  public guardar(): void {
    this.hashMapError.clear();
    this.validateNew();
    if (this.hashMapError.size === 0) {
      if (!this.isEdit) {
        // console.log('this.new()');
        this.new();
      } else {
        // console.log('this.edit()');
        this.edit();
      }
    }
  }

  private validateNew(): void {
    this.permisosModal.name = this.permisosModal.name.trim();
    if (this.permisosModal.name === null || typeof this.permisosModal.name === 'undefined' || this.permisosModal.name === '') {
      this.hashMapError.set('val_name', 'Nombre es Obligatorio');
    }

    this.permisosModal.descrip = this.permisosModal.descrip.trim();
    if (this.permisosModal.descrip === null || typeof this.permisosModal.descrip === 'undefined' || this.permisosModal.descrip === '') {
      this.hashMapError.set('val_descrip', 'Descripción es Obligatorio');
    }

    this.permisosModal.code = this.permisosModal.code.trim();
    if (this.permisosModal.code === null || typeof this.permisosModal.code === 'undefined' || this.permisosModal.code === '') {
      this.hashMapError.set('val_code', 'Código es Obligatorio');
    }
  }

  private new(): void {
    console.log('Cargando new');
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
          this.modals.success('Permiso Creado Con Éxito!');
          this.loadCargar();
        } else if (data.code === '-2') {
          this.modals.warning(data.message);
        } else {
          this.modals.error('Error con la respuesta de servicios de crear Permisos');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de crear Permisos');
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
          this.modals.success('Permiso Modificado Con Éxito!');
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de actualizar Permisos');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de actualizar Permisos');
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
          this.modals.success('Permiso Eliminado Con Éxito!');
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de eliminar Permisos');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de eliminar Permisos');
        this.cargar = false;
      });
  }

  public closeModal() {
    this.modalService.dismissAll();
  }

}
