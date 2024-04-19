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
      listaSocios[index].visibility = false;
      if (index < this.pageSize) {
        listaSocios[index].visibility = true;
      }
    }
  }
  
  constructor(private modalService: NgbModal) {
    this.refreshCountries('Init');
  }

  cambioEstado(socio: DataSocio, content: any) {
    for (let index = 0; index < listaSocios.length; index++) {
      listaSocios[index].selected = false;
    }
    socio.selected = true;

    this.socioModal = socio;
    this.openModalFunction(content);
  }

  validaSelected(): boolean {
    for (let index = 0; index < listaSocios.length; index++) {
      if (listaSocios[index].selected) {
        console.log('return true.');
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
      alert('ya esta seleccionado un Socio.');
    }
  }

  cerfificado() {
    if (!this.validaSelected()) {
      alert('debes seleccionar un Socio para cerfificado.');
    } else {
      alert('ya esta seleccionado un Socio para cerfificado.');
    }
  }

  openModalFunction(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  closeModalFunction() {
    this.modalService.dismissAll();
  }
  /********************************************************/

  buscarByNombre(): void {

  }

  buscarByApePaterno(): void {

  }

  buscarByApeMaterno(): void {

  }

  buscarByRut(): void {

  }

  buscarByCodigo(): void {

  }

  buscarBySector(): void {

  }


  /********************************************************/
}
