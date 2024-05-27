import { PaginRequest } from "../../../../utils/PaginRequest";

export interface SectoresRequest extends PaginRequest {
  codigo: string;// Nombres
  descrip: string;// Descripción
}
export class SectoresRequest {
  constructor() {
    this.codigo = '';
    this.pageSize = 1;
    this.limit = 10;
  }
}