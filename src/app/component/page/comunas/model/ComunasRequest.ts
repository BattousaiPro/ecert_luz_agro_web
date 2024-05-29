import { PaginRequest } from "../../../../utils/PaginRequest";

export interface ComunasRequest extends PaginRequest {
  codigo: string;// Nombres
  descrip: string;// Descripción
}
export class ComunasRequest {
  constructor() {
    this.codigo = '';
    this.pageSize = 1;
    this.limit = 10;
  }
}