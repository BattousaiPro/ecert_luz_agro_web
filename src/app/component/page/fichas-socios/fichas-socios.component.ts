import { Component } from '@angular/core';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { TemplateFichaSocioComponent } from './template-ficha-socio/template-ficha-socio.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fichas-socios',
  standalone: true,
  imports: [SpinnerComponent, TemplateFichaSocioComponent],
  templateUrl: './fichas-socios.component.html',
  styleUrl: './fichas-socios.component.scss'
})
export class FichasSociosComponent {

  cargar: boolean = false;

  constructor(private modalService: NgbModal) { }

  openModalTemplate(content: any) {
    console.log('Method openModalTemplate');
    console.log('Method openDetails.');
    //this.socioModal = socio;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  /********************************************************/
  // Sector de filtros
  buscarByCodigoInicial() {
    console.log('Method buscarByCodigoInicial');
  }
  buscarByCodigoFinal() {
    console.log('Method buscarByCodigoFinal');
  }
  buscarByAnio() {
    console.log('Method buscarByAnio');
  }
  buscarByNroPagina() {
    console.log('Method buscarByNroPagina');
  }
  /********************************************************/

}
