import { Component } from '@angular/core';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SectoresRequest } from './model/SectoresRequest';
import { ModalOptions } from '../../../utils/modalOptions';
import { SectorService } from '../../../services/sector/sector.service';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sectores',
  standalone: true,
  imports: [SpinnerComponent,
    FormsModule,
    NgbPaginationModule,
    CommonModule],
  templateUrl: './sectores.component.html',
  styleUrl: './sectores.component.scss'
})
export class SectoresComponent {

  sectores: Sector[] = [];
  sectoresModal: Sector = new Sector();
  // permisoDeleteModal: Permiso = new Permiso();
  req: SectoresRequest = new SectoresRequest();

  cargar: boolean = false;
  isEdit: boolean = false;
  modals = new ModalOptions();
  collectionSize: number = 0;

  constructor(
    private modalService: NgbModal,
    private sectorService: SectorService
  ) { }

  ngOnInit(): void {
    this.loadCargar();
  }

  public loadCargar(): void {
    console.log('Cargando loadCargar');
    this.cargar = true;
    this.sectorService.obtenerByFilter(this.req).subscribe(
      (data: any) => {
        if (data.code === '0'
          && data.data != null
          && data.data.results != null) {
          this.closeModal();
          this.sectores = [];
          this.sectores.push(...data.data.results);
          this.collectionSize = data.data.totalReg;
        } else {
          this.modals.success('Error con la respuesta de servicios de Roles');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.modals.error('Error con el servicio de Roles');
        this.cargar = false;
      }
    );
  }

  public agregaModal(content: any): void {
    console.log('Method agregaModal.');
    this.sectoresModal = new Sector();
    this.sectoresModal.estado = true;
    this.isEdit = false;
    this.openModalFunction(content);
  }

  public editarModal(content: any, permisosSelected: Sector): void {
    console.log('Method editarModal');
    this.sectoresModal = permisosSelected;
    this.isEdit = true;
    this.openModalFunction(content);
  }

  public deleteModal(content: any, permisosSelected: Sector): void {
    console.log('Method deleteModal');
    this.sectoresModal = permisosSelected;
    this.openModalFunction(content);
  }

  public addModal(content: any, index: number): void {
    this.sectores[index].addSector = !this.sectores[index].addSector;
    console.log('Method agregarUser.');
    this.sectoresModal = new Sector();
    this.sectoresModal.estado = true;
    this.openModalFunction(content);
  }

  private openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  public guardar(): void {
    const code = this.sectoresModal.codigo;
    const descrip = this.sectoresModal.descrip.trim();
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
    this.sectorService.new(
      this.sectoresModal.codigo,
      this.sectoresModal.descrip,
      this.sectoresModal.estado
    ).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargar();
        } else if (data.code === '-2') {
          this.modals.warning(data.message);
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
    this.sectorService.update(
      this.sectoresModal.id,
      this.sectoresModal.codigo,
      this.sectoresModal.descrip,
      this.sectoresModal.estado
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
    this.sectorService.delete(this.sectoresModal.id).subscribe(
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
export interface Sector {
  id: number;
  codigo: number;
  descrip: string;
  dia_car: number;
  cod_cob: number;
  estado: boolean;
  addSector: boolean;

}
export class Sector {
  constructor() {
    this.descrip = '';
    this.addSector = false;
  }
}
