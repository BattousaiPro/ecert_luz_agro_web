import { Component, Input } from '@angular/core';
import { DataSocio } from '../model/dataMock';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-socio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-socio.component.html',
  styleUrl: './detail-socio.component.scss'
})
export class DetailSocioComponent {

  @Input() socio!: DataSocio;
  constructor() { }

}
