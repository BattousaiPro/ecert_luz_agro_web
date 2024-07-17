import { Component, OnInit } from '@angular/core';
import { ModalOptions } from '../../../utils/modalOptions';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ComunasService } from '../../../services/comunas/comunas.service';
import { ComunasRequest } from './model/ComunasRequest';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../utilitarios/spinner/spinner.component';
import { Utility } from '../../../utils/utility';

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

  comunas: Comunas[] = [];
  comunasModal: Comunas = new Comunas();
  req: ComunasRequest = new ComunasRequest();

  cargar: boolean = false;
  isEdit: boolean = false;
  modals = new ModalOptions();
  collectionSize: number = 0;

  erroresList: string[] = [];
  isErroresList: boolean = false;

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
          this.modals.success('Algo paso con la obtención de los Sectotes');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.modals.error('Error con el servicio de Sectotes');
        this.cargar = false;
      }
    );
  }

  public agregaModal(content: any): void {
    console.log('Method agregaModal.');
    this.comunasModal = new Comunas();
    this.comunasModal.estado = true;
    this.isEdit = false;
    this.isErroresList = false;
    this.openModalFunction(content);
  }

  public editarModal(content: any, selectedItem: Comunas): void {
    console.log('Method editarModal');
    this.comunasModal = JSON.parse(JSON.stringify(selectedItem));
    this.isEdit = true;
    this.openModalFunction(content);
  }

  public deleteModal(content: any, selectedItem: Comunas): void {
    console.log('Method deleteModal');
    this.comunasModal = JSON.parse(JSON.stringify(selectedItem));
    this.openModalFunction(content);
  }

  private openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  public guardar(): void {
    this.erroresList = [];
    this.isErroresList = false;
    this.erroresList = this.validateNew();
    if (!this.isEdit) {
      if (this.erroresList.length > 0) {
        this.setIsErroresList(true);
      } else {
        // console.log('this.new()');
        this.new();
      }
    } else {
      if (this.erroresList.length > 0) {
        this.setIsErroresList(false);
      } else {
        // console.log('this.edit()');
        this.edit();
      }
    }
    /*
    const code = this.comunasModal.codigo;
    const descrip = this.comunasModal.descrip.trim();
    if (code !== null && typeof code !== 'undefined' && code !== 0
      && descrip !== null && typeof descrip !== 'undefined' && descrip !== ''
    ) {
      if (!this.isEdit) {
        this.new();
      } else {
        this.edit();
      }
    } else {
      this.modals.info('Nombre o Descripción o Código Son inválido');
    }*/
  }

  private setIsErroresList(isErroresList: boolean): void {
    /*
    for (let index = 0; index < this.erroresList.length; index++) {
      const element = this.erroresList[index];
      console.log('[' + index + ']: ' + element);
    }
    */
    this.isErroresList = isErroresList;
  }

  private validateNew(): string[] {
    let errores: string[] = [];
    this.comunasModal.descrip = this.comunasModal.descrip.trim();
    if (this.comunasModal.descrip === null || typeof this.comunasModal.descrip === 'undefined' || this.comunasModal.descrip === '') {
      errores.push('Descripción es Obligatorio');
    }

    this.comunasModal.codigo = this.comunasModal.codigo;
    if (this.comunasModal.codigo === null || typeof this.comunasModal.codigo === 'undefined') {
      errores.push('Código es Obligatorio');
    } else if (this.comunasModal.codigo !== null && typeof this.comunasModal.codigo !== 'undefined' && this.comunasModal.codigo < 0) {
      errores.push('Código debe ser mayor a 0');
    }
    return errores;
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
          this.loadCargar();
        } else if (data.code === '-4') {
          this.modals.warning(data.message);
        } else {
          this.modals.error('Error con la respuesta de servicios para crear Sectotes');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de crear Sectotes');
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
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de actualizar Sectotes');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de actualizar Sectotes');
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
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de eliminar Sectotes');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de eliminar Sectotes');
        this.cargar = false;
      });
  }

  public closeModal() {
    this.modalService.dismissAll();
  }

}
export interface Comunas {
  id: number;
  codigo: number;
  descrip: string;
  estado: boolean;
  addComuna: boolean;

}
export class Comunas {
  constructor() {
    this.descrip = '';
    this.addComuna = false;
  }
}