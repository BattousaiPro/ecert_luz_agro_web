import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSocioVO } from '../../../../utils/modelsVos';

@Component({
  selector: 'app-detail-socio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-socio.component.html',
  styleUrl: './detail-socio.component.scss'
})
export class DetailSocioComponent {

  @Input() socio!: DataSocioVO;
  constructor() { }

}
