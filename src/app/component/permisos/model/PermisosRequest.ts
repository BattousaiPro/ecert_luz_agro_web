import { PaginRequest } from "../../../utils/PaginRequest";

export interface PermisosRequest extends PaginRequest {
  name: string;// Nombres
}
export class PermisosRequest {
  constructor() {
    this.name = '';
    this.pageSize = 1;
    this.limit = 10;
  }
}