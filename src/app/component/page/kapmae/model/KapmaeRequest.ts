import { PaginRequest } from "../../../../utils/PaginRequest";

export interface KapmaeRequest extends PaginRequest {
  rut_cop: string;// Rut Socio	
  nombres: string;// Nombres
  ape_pat: string;// Apellido Paterno
  ape_mat: string;// Apellido Materno
  cod_cop: number;// Código Luzagro
  sec_cop: number;// Sector
  com_pos: number;// Comuna
}
export class KapmaeRequest {
  constructor() {
    this.rut_cop = '';
    this.nombres = '';
    this.ape_pat = '';
    this.ape_mat = '';
    this.pageSize = 1;
    this.limit = 10;
  }

  clear() {
    this.rut_cop = this.rut_cop !== '' ? this.rut_cop.trim() : '';
    this.nombres = this.nombres !== '' ? this.nombres.trim() : '';
    this.ape_pat = this.ape_pat !== '' ? this.ape_pat.trim() : '';
    this.ape_mat = this.ape_mat !== '' ? this.ape_mat.trim() : '';
  }
}