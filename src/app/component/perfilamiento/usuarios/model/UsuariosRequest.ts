import { PaginRequest } from "../../../../utils/PaginRequest";

export interface UsuariosRequest extends PaginRequest {
  ctaUserName: string;// Nombre
  ctaEmail: string;// Correo
}
export class UsuariosRequest {
  constructor() {
    this.ctaUserName = '';
    this.ctaEmail = '';
    this.pageSize = 1;
    this.limit = 10;
  }
}