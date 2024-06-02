import { Component } from '@angular/core';
import { ModalOptions } from '../../../utils/modalOptions';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ComunasService } from '../../../services/comunas/comunas.service';
import { ComunasRequest } from './model/ComunasRequest';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../spinner/spinner.component';

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
export class ComunasComponent {

  comunas: Comunas[] = [];
  comunasModal: Comunas = new Comunas();
  req: ComunasRequest = new ComunasRequest();

  cargar: boolean = false;
  isEdit: boolean = false;
  modals = new ModalOptions();
  collectionSize: number = 0;

  constructor(
    private modalService: NgbModal,
    private comunasService: ComunasService
  ) { }

  ngOnInit(): void {
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
    this.openModalFunction(content);
  }

  public editarModal(content: any, comunaSelected: Comunas): void {
    console.log('Method editarModal');
    this.comunasModal = comunaSelected;
    this.isEdit = true;
    this.openModalFunction(content);
  }

  public deleteModal(content: any, comunaSelected: Comunas): void {
    console.log('Method deleteModal');
    this.comunasModal = comunaSelected;
    this.openModalFunction(content);
  }

  private openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  public guardar(): void {
    const code = this.comunasModal.codigo;
    const descrip = this.comunasModal.descrip.trim();
    if (code !== null && typeof code !== 'undefined' && code !== 0
      && descrip !== null && typeof descrip !== 'undefined' && descrip !== ''
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