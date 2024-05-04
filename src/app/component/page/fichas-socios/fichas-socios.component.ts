import { Component } from '@angular/core';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { TemplateFichaSocioComponent } from './template-ficha-socio/template-ficha-socio.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fichas-socios',
  standalone: true,
  imports: [SpinnerComponent, TemplateFichaSocioComponent, FormsModule],
  templateUrl: './fichas-socios.component.html',
  styleUrl: './fichas-socios.component.scss'
})
export class FichasSociosComponent {

  cargar: boolean = false;
  codigoInicial: string = '';
  codigoFinal: string = '';
  anio: number = 0;
  nroPagina!: number;
  anioList: number[] = [];

  constructor(private modalService: NgbModal) {
    this.loadAnio();
  }

  private loadAnio(): void {
    this.anioList.push(2022);
    this.anioList.push(2021);
    this.anioList.push(2020);
    this.anioList.push(2019);
    this.anioList.push(2018);
    this.anioList.push(2017);
  }

  submit(content: any) {
    const aaanio: string = '' + this.anio;
    console.log('this.anio.length: ' + aaanio.length);
    const nroPagina: string = '' + this.nroPagina;
    console.log('this.anio.length: ' + nroPagina.length);
    if (
      this.codigoInicial != '' && typeof this.codigoInicial !== 'undefined' &&
      this.codigoFinal != '' && typeof this.codigoFinal !== 'undefined' &&
      aaanio !== '' && aaanio.length === 4 &&
      nroPagina !== '' && nroPagina.length === 4) {
      this.openModalTemplate(content);
    } else {
      alert('todos los campos deben ser completados.');
    }

  }

  openModalTemplate(content: any) {
    console.log('Method openModalTemplate');
    //this.socioModal = socio;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  /********************************************************/
  // Sector de filtros
  buscarByCodigoInicial() {
    //console.log('Method buscarByCodigoInicial');
  }
  buscarByCodigoFinal() {
    //console.log('Method buscarByCodigoFinal');
  }
  buscarByAnio() {
    //console.log('Method buscarByAnio');
    if (this.anio >= 9999) {
      this.anio = 9999;
    } else if (this.anio <= 0) {
      this.anio = 1;
    }
  }
  buscarByNroPagina() {
    //console.log('Method buscarByNroPagina');
    if (this.nroPagina >= 9999) {
      this.nroPagina = 9999;
    } else if (this.nroPagina <= 0) {
      this.anio = 1;
    }
  }
  /********************************************************/

  public inpNum(event: any): void {
    event = event || window.event;
    var charCode = (typeof event.which == 'undefined') ? event.keyCode : event.which;
    var charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[0-9]+$/)) {
      event.preventDefault();
    }
  }

}
