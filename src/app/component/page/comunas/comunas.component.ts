import { Component, OnInit } from '@angular/core';
import { ModalOptions } from '../../../utils/modalOptions';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ComunasService } from '../../../services/comunas/comunas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../utilitarios/spinner/spinner.component';
import { Utility } from '../../../utils/utility';
import { ComunasVO, ComunasRequestVO } from '../../../utils/modelsVos';

@Component({
  selector: 'app-comunas',
  standalone: true,
  imports: [SpinnerComponent,
    FormsModule,
    NgbPaginationModule,
    CommonModule],
  templateUrl: './comunas.component.html',
  styleUrl: './comunas.component.scss'
})
export class ComunasComponent implements OnInit {

  comunas: ComunasVO[] = [];
  comunasModal: ComunasVO = new ComunasVO();
  req: ComunasRequestVO = new ComunasRequestVO();

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
    private comunasService: ComunasService
  ) { }

  setPermiso(): void {
    this.isPermisoVerLista = this.utility.consultar('LUZ_AGRO_MENU_COMUNA');
    this.isPermisoDelete = this.utility.consultar('LUZ_AGRO_COMUNA_DELETE');
    this.isPermisoEdit = this.utility.consultar('LUZ_AGRO_COMUNA_EDIT');
    this.isPermisoCreate = this.utility.consultar('LUZ_AGRO_COMUNA_CREATE');
  }

  ngOnInit(): void {
    this.setPermiso();
    if (this.isPermisoVerLista)
      this.loadCargar();
  }

  public loadCargar(): void {
    console.log('Cargando loadCargar');
    this.cargar = true;
    this.comunasService.obtenerByFilter(this.req).subscribe(
      (data: any) => {
        if (data.code === '0'
          && data.data != null
          && data.data.results != null) {
          this.closeModal();
          this.comunas = [];
          this.comunas.push(...data.data.results);
          this.collectionSize = data.data.totalReg;
        } else {
          this.modals.success('Algo paso con la obtención de las Comunas');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.modals.error('Error con el servicio de Comunas');
        this.cargar = false;
      }
    );
  }

  public agregaModal(content: any): void {
    console.log('Method agregaModal.');
    this.comunasModal = new ComunasVO();
    this.comunasModal.estado = true;
    this.isEdit = false;
    this.hashMapError.clear();
    this.openModalFunction(content);
  }

  public editarModal(content: any, selectedItem: ComunasVO): void {
    console.log('Method editarModal');
    this.comunasModal = JSON.parse(JSON.stringify(selectedItem));
    this.isEdit = true;
    this.hashMapError.clear();
    this.openModalFunction(content);
  }

  public deleteModal(content: any, selectedItem: ComunasVO): void {
    console.log('Method deleteModal');
    this.comunasModal = JSON.parse(JSON.stringify(selectedItem));
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
    this.comunasModal.descrip = this.comunasModal.descrip.trim();
    if (this.comunasModal.descrip === null || typeof this.comunasModal.descrip === 'undefined' || this.comunasModal.descrip === '') {
      this.hashMapError.set('val_descrip', 'Descripción es Obligatorio');
    }
    this.comunasModal.codigo = this.comunasModal.codigo;
    if (this.comunasModal.codigo === null || typeof this.comunasModal.codigo === 'undefined') {
      this.hashMapError.set('val_codigo', 'Código es Obligatorio');
    } else if (this.comunasModal.codigo !== null && typeof this.comunasModal.codigo !== 'undefined' && this.comunasModal.codigo < 0) {
      this.hashMapError.set('val_codigo', 'Código debe ser mayor a 0');
    }
  }

  private new(): void {
    console.log('Cargando new');
    this.cargar = true;
    this.comunasService.new(
      this.comunasModal.codigo,
      this.comunasModal.descrip,
      this.comunasModal.estado
    ).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.modals.success('Comuna Creado Con Éxito!');
          this.loadCargar();
        } else if (data.code === '-4') {
          this.modals.warning(data.message);
        } else {
          this.modals.error('Error con la respuesta de servicios para crear Comunas');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de crear Comunas');
        this.cargar = false;
      });
  }

  private edit(): void {
    console.log('Cargando edit');
    this.cargar = true;
    this.comunasService.update(
      this.comunasModal.codigo,
      this.comunasModal.codigo,
      this.comunasModal.descrip,
      this.comunasModal.estado
    ).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.modals.success('Comuna Modificado Con Éxito!');
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de actualizar Comuna');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de actualizar Comuna');
        this.cargar = false;
      });
  }

  public delete(): void {
    console.log('Cargando edit');
    this.cargar = true;
    this.comunasService.delete(this.comunasModal.codigo).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.modals.success('Comuna Eliminado Con Éxito!');
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de eliminar Comunas');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de eliminar Comunas');
        this.cargar = false;
      });
  }

  public closeModal() {
    this.modalService.dismissAll();
  }

}
