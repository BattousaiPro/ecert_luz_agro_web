import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Utility } from '../../utils/utility';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public utility = new Utility;
  isSocio: boolean = false;
  isFicha: boolean = false;
  isSector: boolean = false;
  isComuna: boolean = false;
  isUser: boolean = false;
  isRol: boolean = false;
  isPermiso: boolean = false;

  constructor() { }

  setPermiso(): void {
    this.isSocio = this.utility.consultar('LUZ_AGRO_MENU_SOCIO');
    this.isFicha = this.utility.consultar('LUZ_AGRO_MENU_FICHA');
    this.isSector = this.utility.consultar('LUZ_AGRO_MENU_SECTOR');
    this.isComuna = this.utility.consultar('LUZ_AGRO_MENU_COMUNA');
    this.isUser = this.utility.consultar('LUZ_AGRO_MENU_USUARIO');
    this.isRol = this.utility.consultar('LUZ_AGRO_MENU_ROL');
    this.isPermiso = this.utility.consultar('LUZ_AGRO_MENU_PERMISO');
  }

  ngOnInit(): void {
    this.setPermiso();
  }

}
