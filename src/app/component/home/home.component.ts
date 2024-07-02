import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Uyility } from '../../utils/utility';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public permisosAcces = new Uyility;
  isPermisoSocio: boolean = false;
  isPermisoFicha: boolean = false;
  isPermisoSector: boolean = false;
  isPermisoComuna: boolean = false;
  isPermisoUser: boolean = false;
  isPermisoRol: boolean = false;
  isPermisoPermiso: boolean = false;

  constructor() { }

  setPermiso(): void {
    this.isPermisoSocio = this.permisosAcces.consultar('LUZ_AGRO_MENU_SOCIO');
    this.isPermisoFicha = this.permisosAcces.consultar('LUZ_AGRO_MENU_FICHA');
    this.isPermisoSector = this.permisosAcces.consultar('LUZ_AGRO_MENU_SECTOR');
    this.isPermisoComuna = this.permisosAcces.consultar('LUZ_AGRO_MENU_COMUNA');
    this.isPermisoUser = this.permisosAcces.consultar('LUZ_AGRO_MENU_USUARIO');
    this.isPermisoRol = this.permisosAcces.consultar('LUZ_AGRO_MENU_ROL');
    this.isPermisoPermiso = this.permisosAcces.consultar('LUZ_AGRO_MENU_PERMISO');
  }

  ngOnInit(): void {
    this.setPermiso();
  }

}
