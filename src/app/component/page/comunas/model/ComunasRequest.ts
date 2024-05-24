import { PaginRequest } from "../../../../utils/PaginRequest";

export interface ComunasRequest extends PaginRequest {
  name: string;// Nombres
}
export class ComunasRequest {
  constructor() {
    this.name = '';
    this.pageSize = 1;
    this.limit = 10;
  }
}