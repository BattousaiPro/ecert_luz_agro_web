import { Component } from '@angular/core';
import { DataSocio } from './model/DataSocio';
import { DetailSocioComponent } from './detail-socio/detail-socio.component';
import { SpinnerComponent } from '../../utilitarios/spinner/spinner.component';
import { NgbModal, NgbPaginationModule, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KapmaeService } from '../../../services/kapmae/kapmae.service';
import { ModalOptions } from '../../../utils/modalOptions';
import { KapmaeRequest } from './model/KapmaeRequest';
import { SectorService } from '../../../services/sector/sector.service';
import { ComunasService } from '../../../services/comunas/comunas.service';
import { Sector } from '../sectores/sectores.component';
import { Comunas } from '../comunas/comunas.component';

@Component({
  selector: 'app-kapmae',
  standalone: true,
  imports: [FormsModule,
    DetailSocioComponent,
    SpinnerComponent,
    CommonModule,
    NgbPaginationModule,
    NgbInputDatepicker,
  ],
  templateUrl: './kapmae.component.html',
  styleUrl: './kapmae.component.scss'
})
export class KapmaeComponent {

  sectores: Sector[] = [];
  comunas: Comunas[] = [];;

  socios: DataSocio[] = [];
  socioModal: DataSocio = new DataSocio();
  socioDeleteModal: DataSocio = new DataSocio();
  req: KapmaeRequest = new KapmaeRequest();

  cargar: boolean = false;
  isEdit: boolean = false;
  modals = new ModalOptions();
  collectionSize: number = 0;

  principalContainer: boolean = true;

  constructor(private modalService: NgbModal,
    private kapmaeService: KapmaeService,
    private sectorService: SectorService,
    private comunasService: ComunasService,
  ) {
    this.loadCargar();
    this.loadCargarSector();
    this.loadCargarComunas();
  }

  public loadCargar(): void {
    console.log('Cargando loadCargar');
    this.cargar = true;
    this.kapmaeService.obtenerByFilter(this.req).subscribe(
      (data: any) => {
        // console.log(JSON.stringify(data));
        if (data.code === '0'
          && data.data != null
          && data.data.results != null) {
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

  public loadCargarSector(): void {
    console.log('Cargando loadCargarSector');
    this.cargar = true;
    this.sectorService.getAll().subscribe(
      (data: any) => {
        if (data.code === '0'
          && data.data != null) {
          this.closeModal();
          this.sectores = [];
          this.sectores.push(...data.data);
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

  public loadCargarComunas(): void {
    console.log('Cargando loadCargarComunas');
    this.cargar = true;
    this.comunasService.getAll().subscribe(
      (data: any) => {
        if (data.code === '0'
          && data.data != null) {
          this.closeModal();
          this.comunas = [];
          this.comunas.push(...data.data);
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

  public deleteModal(content: any, selectedItem: DataSocio): void {
    console.log('Method deleteModal');
    this.socioDeleteModal = JSON.parse(JSON.stringify(selectedItem));
    this.openModalFunction(content);
  }

  public editarModal(selectedItem: DataSocio): void {
    console.log('Method editarModal');
    /*
    this.socioModal = JSON.parse(JSON.stringify(selectedItem));
    this.isEdit = true;
    this.principalContainer = false;
    */
    this.modals.info('Funcionalidad No disponible');
  }

  public agregaModal(): void {
    console.log('Method agregaModal.');
    /*
    this.socioModal = new DataSocio();
    this.isEdit = false;
    this.principalContainer = false;
    */
    this.modals.info('Funcionalidad No disponible');
  }

  public guardar(): void {
    this.modals.info('Funcionalidad No disponible');
  }

  volverDetalle() {
    this.principalContainer = true;
  }

}
