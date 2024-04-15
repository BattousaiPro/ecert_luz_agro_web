import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detail-socio',
  standalone: true,
  imports: [],
  templateUrl: './detail-socio.component.html',
  styleUrl: './detail-socio.component.scss'
})
export class DetailSocioComponent {

  @Input() item: any;

}
