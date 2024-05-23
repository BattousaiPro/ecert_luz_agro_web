import { PaginRequest } from "../../../utils/PaginRequest";

export interface UsuariosRequest extends PaginRequest {
  ctaUsr: string;// Nombre
}
export class UsuariosRequest {
  constructor() {
    this.ctaUsr = '';
  }
}