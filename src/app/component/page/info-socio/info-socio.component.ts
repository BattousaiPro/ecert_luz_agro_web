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
    if (!listaSocios[index].selected) {
      for (let index = 0; index < listaSocios.length; index++) {
        listaSocios[index].selected = false;
      }
    }
    listaSocios[index].selected = !listaSocios[index].selected;
  }
}
