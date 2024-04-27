import { Component } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-template-ficha-socio',
  standalone: true,
  imports: [],
  templateUrl: './template-ficha-socio.component.html',
  styleUrl: './template-ficha-socio.component.scss'
})
export class TemplateFichaSocioComponent {

  public generatePDF(): void {
    const doc = new jsPDF();
    doc.text('Hola Koke buenos días', 10, 10);
    doc.save('Buenos días xD.pdf');
  }

}
