import { Component } from '@angular/core';
import { DataSocio, listaSocios } from './model/dataMock';
import { DetailSocioComponent } from '../detail-socio/detail-socio.component';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-info-socio',
  standalone: true,
  imports: [DetailSocioComponent, SpinnerComponent],
  templateUrl: './info-socio.component.html',
  styleUrl: './info-socio.component.scss'
})
export class InfoSocioComponent {
  socios: DataSocio[] = listaSocios;
  cargar: boolean = false;

  cambioEstado(index: any) {
    if (!listaSocios[index].selected) {
      for (let index = 0; index < listaSocios.length; index++) {
        listaSocios[index].selected = false;
      }
    }
    listaSocios[index].selected = !listaSocios[index].selected;
  }
}
