export interface PaginRequest {
    limit: number;
    pageSize: number;
  }
  export class PaginRequest {
    constructor() {
        this.pageSize = 1;
        this.limit = 10;
      }
  }