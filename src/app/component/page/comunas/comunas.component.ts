import { Component } from '@angular/core';

@Component({
  selector: 'app-comunas',
  standalone: true,
  imports: [],
  templateUrl: './comunas.component.html',
  styleUrl: './comunas.component.scss'
})
export class ComunasComponent {

}
export interface Comunas {
  id: number;
  codigo: number;
  descrip: string;
  estado: boolean;
  addComuna: boolean;

}
export class Comunas {
  constructor() {
    this.descrip = '';
    this.addComuna = false;
  }
}