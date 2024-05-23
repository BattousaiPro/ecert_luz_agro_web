import { PaginRequest } from "../../../../utils/PaginRequest";

export interface KapmaeRequest extends PaginRequest {
  rut_cop: string;// Rut Socio	
  nombres: string;// Nombres
  ape_pat: string;// Apellido Paterno
  ape_mat: string;// Apellido Materno
  cod_cop: number;// Código Luzagro
  sec_cop: number;// Sector
}
export class KapmaeRequest {
  constructor() {
    this.rut_cop = '';
    this.nombres = '';
    this.ape_pat = '';
    this.ape_mat = '';
  }
}