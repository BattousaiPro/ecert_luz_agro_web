import { Component } from '@angular/core';
import { listaSocios } from './model/dataMock';
import { DataSocio } from './model/DataSocio';
import { DetailSocioComponent } from './detail-socio/detail-socio.component';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KapmaeService } from '../../../services/kapmae/kapmae.service';
import { ModalOptions } from '../../../utils/modalOptions';

@Component({
  selector: 'app-info-socio',
  standalone: true,
  imports: [FormsModule,
    DetailSocioComponent,
    SpinnerComponent,
    CommonModule,
    NgbPaginationModule],
  templateUrl: './info-socio.component.html',
  styleUrl: './info-socio.component.scss'
})
export class InfoSocioComponent {

  socios: DataSocio[] = [];

  socioModal: DataSocio = new DataSocio();
  socioDeleteModal: DataSocio = new DataSocio();
  req: KapmaeRequest = new KapmaeRequest();
  cargar: boolean = false;
  modals = new ModalOptions();
  isEdit: boolean = false;
  principalContainer: boolean = true;

  collectionSize: number = 0;

  constructor(private modalService: NgbModal,
    private kapmaeService: KapmaeService
  ) {
    this.loadCargarKapMae();
  }

  public loadCargarKapMae(): void {
    console.log('Cargando loadCargarUsers');
    this.cargar = true;
    this.kapmaeService.obtenerKapMaeByFilter(this.req).subscribe(
      (data: any) => {
        // console.log(JSON.stringify(data));
        if (data.code === '0' && data.data != null && data.data.results != null) {
          this.socios = [];
          this.socios.push(...data.data.results);
          //this.socios.push(...listaSocios);
          this.collectionSize = data.data.totalReg;
          this.setDefaultSociosData(this.socios);
        } else {
          this.modals.error('Error con el servicio de Socios');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.modals.error('Error con el servicio de Socios');
        this.cargar = false;
      });
  }

  private setDefaultSociosData(socios: DataSocio[]) {
    for (let index = 0; index < socios.length; index++) {
      socios[index].selected = false;
    }
  }

  statusChange(socio: DataSocio, id: string = '') {
    console.log('Method cambioEstado.');
    if (id === '') {
      socio.selected = !socio.selected;
      for (let index = 0; index < this.socios.length; index++) {
        if (this.socios[index].id !== socio.id) {
          this.socios[index].selected = false;
        }
      }
    }
  }

  openDetails(socio: DataSocio, content: any) {
    console.log('Method openDetails.');
    this.socioModal = socio;
    this.openModalFunction(content);
  }

  validaSelected(): boolean {
    for (let index = 0; index < this.socios.length; index++) {
      if (this.socios[index].selected) {
        return true;
      }
    }
    console.log('return false.');
    return false;
  }

  seleccionar() {
    if (!this.validaSelected()) {
      this.modals.warning('debes seleccionar un Socio');
    } else {
      this.modals.info('Funcionalidad No disponible');
    }
  }

  cerfificado() {
    if (!this.validaSelected()) {
      this.modals.warning('debes seleccionar un Socio para cerfificado');
    } else {
      this.modals.info('Funcionalidad No disponible');
    }
  }

  noDisponible() {
    this.modals.info('Funcionalidad No disponible');
  }

  openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  /********************************************************/
  // Sector de filtros
  public buscarByCodigo(): void {
    console.log('Method buscarByCodigo');
  }

  public buscarBySector(): void {
    console.log('Method buscarBySector');
  }
  /********************************************************/

  public delete(): void {
    this.noDisponible();
  }

  public deleteModal(content: any, userSelected: DataSocio): void {
    console.log('Method deleteModal');
    this.socioDeleteModal = userSelected;
    this.openModalFunction(content);
  }

  public editarModal(userSelected: DataSocio): void {
    console.log('Method editarModal');
    this.socioModal = userSelected;
    this.isEdit = true;
    this.principalContainer = false;
    // this.openModalFunction(content);
  }

  public agregaModal(): void {
    console.log('Method agregaModal.');
    this.socioModal = new DataSocio();
    this.isEdit = false;
    this.principalContainer = false;
    //this.openModalFunction(content);
  }

  public guardar(): void {
    this.modals.info('Funcionalidad No disponible');
  }

  volverDetalle() {
    this.principalContainer = true;
  }

}

export interface KapmaeRequest extends PaginRequest {
  rut_cop: string;// Rut Socio	
  nombres: string;// Nombres
  ape_pat: string;// Apellido Paterno
  ape_mat: string;// Apellido Materno
  cod_cop: number;// Código Luzagro
  sec_cop: number;// Sector
}
export class KapmaeRequest {
  constructor() {
    this.rut_cop = '';
    this.nombres = '';
    this.ape_pat = '';
    this.ape_mat = '';
    this.pageSize = 1;
    this.limit = 10;
  }
}

export interface PaginRequest {
  limit: number;
  pageSize: number;
}
export class PaginRequest { }