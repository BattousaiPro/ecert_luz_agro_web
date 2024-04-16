import { Component, Input } from '@angular/core';
import { DataSocio } from '../info-socio/model/dataMock';

@Component({
  selector: 'app-detail-socio',
  standalone: true,
  imports: [],
  templateUrl: './detail-socio.component.html',
  styleUrl: './detail-socio.component.scss'
})
export class DetailSocioComponent {

  @Input() socio!: DataSocio;

}
