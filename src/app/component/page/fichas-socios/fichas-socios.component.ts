import { Component } from '@angular/core';
import jsPDF from 'jspdf';

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
    //alert('Funcionalidad No disponible');
    const doc = new jsPDF();
    doc.text('Hola Koke buenos días', 10, 10);
    doc.save('Buenos días xD.pdf');
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
