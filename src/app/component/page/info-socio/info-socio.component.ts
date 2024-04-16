import { Component } from '@angular/core';
import { DataSocio, listaSocios } from './model/dataMock';
import { DetailSocioComponent } from '../detail-socio/detail-socio.component';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info-socio',
  standalone: true,
  imports: [DetailSocioComponent, SpinnerComponent],
  templateUrl: './info-socio.component.html',
  styleUrl: './info-socio.component.scss'
})
export class InfoSocioComponent {
  socios: DataSocio[] = listaSocios;
  socioModal!: DataSocio;
  cargar: boolean = false;

  constructor(private modalService: NgbModal) { }

  cambioEstado(socio: DataSocio, content: any) {
    this.socioModal = socio;
    this.openModalFunction(content);
  }

  openModalFunction(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  closeModalFunction() {
    this.modalService.dismissAll();
  }
}
