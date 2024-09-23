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

  erroresList: string[] = [];
  isErroresList: boolean = false;

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
    this.erroresList = [];
    this.setIsErroresList(false);
    this.openModalFunction(content);
  }

  public editarModal(content: any, selectedItem: SectorVO): void {
    console.log('Method editarModal');
    this.sectoresModal = JSON.parse(JSON.stringify(selectedItem));
    this.isEdit = true;
    this.erroresList = [];
    this.setIsErroresList(false);
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
    this.erroresList = [];
    this.isErroresList = false;
    this.erroresList = this.validateNew();
    if (this.erroresList.length > 0) {
      this.setIsErroresList(true);
    } else {
      if (!this.isEdit) {
        // console.log('this.new()');
        this.new();
      } else {
        // console.log('this.edit()');
        this.edit();
      }
    }
  }

  private setIsErroresList(isErroresList: boolean): void {
    this.isErroresList = isErroresList;
  }

  private validateNew(): string[] {
    let errores: string[] = [];
    this.sectoresModal.descrip = this.sectoresModal.descrip.trim();
    if (this.sectoresModal.descrip === null || typeof this.sectoresModal.descrip === 'undefined' || this.sectoresModal.descrip === '') {
      errores.push('Descripción es Obligatorio');
    }

    this.sectoresModal.codigo = this.sectoresModal.codigo;
    if (this.sectoresModal.codigo === null || typeof this.sectoresModal.codigo === 'undefined') {
      errores.push('Código es Obligatorio');
    } else if (this.sectoresModal.codigo !== null && typeof this.sectoresModal.codigo !== 'undefined' && this.sectoresModal.codigo < 0) {
      errores.push('Código debe ser mayor a 0');
    }
    return errores;
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
