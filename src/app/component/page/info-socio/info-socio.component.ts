import { Component } from '@angular/core';
import { listaSocios } from './model/dataMock';

@Component({
  selector: 'app-info-socio',
  standalone: true,
  imports: [],
  templateUrl: './info-socio.component.html',
  styleUrl: './info-socio.component.scss'
})
export class InfoSocioComponent {
  socios: any[] = listaSocios;

  cambioEstado(index: any) {
    listaSocios[index].selected = !listaSocios[index].selected;
  }
}
