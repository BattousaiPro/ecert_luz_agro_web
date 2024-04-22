import { Component } from '@angular/core';
import { DataSocio, listaSocios } from './model/dataMock';
import { DetailSocioComponent } from '../detail-socio/detail-socio.component';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-info-socio',
  standalone: true,
  imports: [FormsModule, DetailSocioComponent, SpinnerComponent, CommonModule, NgbPaginationModule],
  templateUrl: './info-socio.component.html',
  styleUrl: './info-socio.component.scss'
})
export class InfoSocioComponent {
  socios: DataSocio[] = listaSocios;
  socioModal!: DataSocio;
  cargar: boolean = false;

  collectionSize: number = this.socios.length;
  page = 1;
  pageSize = 5;

  refreshCountries(texto: string) {
    console.log(texto);
    for (let index = 0; index < listaSocios.length; index++) {
      listaSocios[index].selected = false;
    }
  }

  constructor(private modalService: NgbModal) {
    this.refreshCountries('Init');
  }

  cambioEstado(socio: DataSocio, id: string = '') {
    console.log('Method cambioEstado.');
    if (id === '') {
      if (!socio.selected) {
        socio.selected = true;
      } else {
        socio.selected = false;
      }
      for (let index = 0; index < listaSocios.length; index++) {
        if (listaSocios[index].id !== socio.id) {
          listaSocios[index].selected = false;
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
    for (let index = 0; index < listaSocios.length; index++) {
      if (listaSocios[index].selected) {
        return true;
      }
    }
    console.log('return false.');
    return false;
  }

  seleccionar() {
    if (!this.validaSelected()) {
      alert('debes seleccionar un Socio.');
    } else {
      alert('Funcionalidad No disponible.');
    }
  }

  cerfificado() {
    if (!this.validaSelected()) {
      alert('debes seleccionar un Socio para cerfificado.');
    } else {
      alert('Funcionalidad No disponible.');
    }
  }

  openModalFunction(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  closeModalFunction() {
    this.modalService.dismissAll();
  }

  /********************************************************/
  // Sector de filtros
  public buscarByNombre(): void {
    console.log('Method buscarByNombre');
  }

  public buscarByApePaterno(): void {
    console.log('Method buscarByApePaterno');
  }

  public buscarByApeMaterno(): void {
    console.log('Method buscarByApeMaterno');
  }

  public buscarByRut(): void {
    console.log('Method buscarByRut');
  }

  public buscarByCodigo(): void {
    console.log('Method buscarByCodigo');
  }

  public buscarBySector(): void {
    console.log('Method buscarBySector');
  }

  public buscarByComuna() {
    console.log('Method buscarByComuna');
  }
  /********************************************************/

}
