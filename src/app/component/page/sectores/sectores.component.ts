import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from '../../../utils/modalOptions';
import { SectorService } from '../../../services/sector/sector.service';
import { SpinnerComponent } from '../../utilitarios/spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Utility } from '../../../utils/utility';
import { SectorVO, SectoresRequestVO } from '../../../utils/modelsVos';

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
export class SectoresComponent implements OnInit {

  sectores: SectorVO[] = [];
  sectoresModal: SectorVO = new SectorVO();
  req: SectoresRequestVO = new SectoresRequestVO();

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
    private sectorService: SectorService
  ) { }

  setPermiso(): void {
    this.isPermisoVerLista = this.utility.consultar('LUZ_AGRO_MENU_SECTOR');
    this.isPermisoDelete = this.utility.consultar('LUZ_AGRO_SECTOR_DELETE');
    this.isPermisoEdit = this.utility.consultar('LUZ_AGRO_SECTOR_EDIT');
    this.isPermisoCreate = this.utility.consultar('LUZ_AGRO_SECTOR_CREATE');
  }

  ngOnInit(): void {
    this.setPermiso();
    if (this.isPermisoVerLista)
      this.loadCargar();
  }

  public loadCargar(): void {
    console.log('Cargando loadCargar');
    this.cargar = true;
    this.sectorService.findByFilter(this.req).subscribe(
      (data: any) => {
        if (data.body.code === '0'
          && data.body.data != null
          && data.body.data.results != null) {
          this.closeModal();
          this.sectores = [];
          this.sectores.push(...data.body.data.results);
          this.collectionSize = data.body.data.totalReg;
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
    this.sectoresModal = new SectorVO();
    this.sectoresModal.estado = true;
    this.isEdit = false;
    this.hashMapError.clear();
    this.openModalFunction(content);
  }

  public editarModal(content: any, selectedItem: SectorVO): void {
    console.log('Method editarModal');
    this.sectoresModal = JSON.parse(JSON.stringify(selectedItem));
    this.isEdit = true;
    this.hashMapError.clear();
    this.openModalFunction(content);
  }

  public deleteModal(content: any, selectedItem: SectorVO): void {
    console.log('Method deleteModal');
    this.sectoresModal = JSON.parse(JSON.stringify(selectedItem));
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
    this.sectoresModal.descrip = this.sectoresModal.descrip.trim();
    if (this.sectoresModal.descrip === null || typeof this.sectoresModal.descrip === 'undefined' || this.sectoresModal.descrip === '') {
      this.hashMapError.set('val_descrip', 'Descripción es Obligatorio');
    }

    this.sectoresModal.codigo = this.sectoresModal.codigo;
    if (this.sectoresModal.codigo === null || typeof this.sectoresModal.codigo === 'undefined') {
      this.hashMapError.set('val_codigo', 'Código es Obligatorio');
    } else if (this.sectoresModal.codigo !== null && typeof this.sectoresModal.codigo !== 'undefined' && this.sectoresModal.codigo < 0) {
      this.hashMapError.set('val_codigo', 'Código debe ser mayor a 0');
    }
  }

  private new(): void {
    console.log('Cargando new');
    this.cargar = true;
    this.sectorService.new(
      this.sectoresModal.codigo,
      this.sectoresModal.descrip,
      this.sectoresModal.estado
    ).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.modals.success('Sector Creado Con Éxito!');
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
    this.sectorService.update(
      this.sectoresModal.codigo,
      this.sectoresModal.codigo,
      this.sectoresModal.descrip,
      this.sectoresModal.estado
    ).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.modals.success('Sector Modificado Con Éxito!');
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
    console.log('Cargando delete');
    this.cargar = true;
    this.sectorService.delete(this.sectoresModal.codigo).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.modals.success('Sector Eliminado Con Éxito!');
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
