import { Component } from '@angular/core';
import { DataSocio, listaSocios } from './model/dataMock';
import { DetailSocioComponent } from '../detail-socio/detail-socio.component';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-socio',
  standalone: true,
  imports: [DetailSocioComponent, SpinnerComponent, CommonModule],
  templateUrl: './info-socio.component.html',
  styleUrl: './info-socio.component.scss'
})
export class InfoSocioComponent {
  socios: DataSocio[] = listaSocios;
  socioModal!: DataSocio;
  cargar: boolean = false;

  constructor(private modalService: NgbModal) { }

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
      listaSocios[index].selected = false;
      if (listaSocios[index].selected) {
        console.log('return true.');
        return true;
      }
    }
    console.log('return false.');
    return false;
  }

  seleccionar() {
    debugger
    if (!this.validaSelected()) {
      alert('debes seleccionar un Socio.');
    } else {
      alert('ya esta seleccionado un Socio.');
    }
  }

  cerfificado() {
    debugger
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
}
