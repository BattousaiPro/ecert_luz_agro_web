import { Component } from '@angular/core';

@Component({
  selector: 'app-fichas-socios',
  standalone: true,
  imports: [],
  templateUrl: './fichas-socios.component.html',
  styleUrl: './fichas-socios.component.scss'
})
export class FichasSociosComponent {

  aceptar() {
    console.log('Method aceptar');
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
