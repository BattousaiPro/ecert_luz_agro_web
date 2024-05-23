import { PaginRequest } from "../../../utils/PaginRequest";

export interface PermisosRequest extends PaginRequest {
  name: string;// Nombres
}
export class PermisosRequest {
  constructor() {
    this.name = '';
  }
}