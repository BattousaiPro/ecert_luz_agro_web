export interface DataSocioVO {
  rut_cop: string;
  ape_pat?: string;
  ape_mat?: string;
  nombres?: string;
  cod_cop: number;
  cod_lli?: number;
  cod_ant?: number;
  cod_nvo?: number;
  cod_ori?: number;
  sec_cop?: SectorVO;
  ano_inc?: number;
  mto_inc?: number;
  fec_inc?: Date;
  ano_tra?: number;
  kap_tra?: number;
  fec_tra?: Date;
  acc_tra?: number;
  acc_ret?: number;
  acc_apo?: number;
  fec_act?: Date;
  est_tra?: string;
  est_bon?: number;
  dir_pos?: string;
  nro_te1?: string;
  nro_te2?: string;
  nro_te3?: string;
  nro_te4?: string;
  com_pos?: ComunasVO;
  obs_cap?: string;
  nro_sol?: number;
  fec_sol?: Date;
  fec_apr?: Date;
  fec_can?: Date;
  est_sol?: string;
  sec_cte?: number;
  area?: number;
  sec_imp?: number;
  est_reg?: string;
  acc_con?: number;
  aju_acc?: number;
  selected?: boolean;

  // Attr de apoyo
  sec_cop_codigo?: string;
  com_pos_codigo?: string;
  fec_inc_date?: DatepickerModelVO;
  fec_tra_date?: DatepickerModelVO;
  fec_act_date?: DatepickerModelVO;
  fec_sol_date?: DatepickerModelVO;
  fec_apr_date?: DatepickerModelVO;
  fec_can_date?: DatepickerModelVO;

}
export class DataSocioVO {
  constructor() {
    this.selected = false;
    this.sec_cop = new SectorVO();
    this.com_pos = new ComunasVO();
  }
}

export interface SectorVO {
  codigo: number;
  descrip: string;
  diaCar: number;
  codCob: number;
  estado: boolean;
}
export class SectorVO {
  constructor() {
    this.descrip = '';
  }
}

export interface ComunasVO {
  id: number;
  codigo: number;
  descrip: string;
  estado: boolean;
  addComuna: boolean;
}
export class ComunasVO {
  constructor() {
    this.descrip = '';
    this.addComuna = false;
  }
}

export interface DatepickerModelVO {
  year?: number;
  month?: number;
  day?: number;
}
export class DatepickerModelVO {
  constructor() {
  }
}

export interface DocumentosImgVO {
  imagenes: ImgListaVO[];
  basePath: string;
}
export class DocumentosImgVO {
  constructor() {
  }
}

export interface ImgListaVO {
  imagen: imgVO;
  estado: boolean;
}
export class ImgListaVO {
  constructor() {
    this.estado = false;
  }
}

export interface imgVO {
  pathImg: string;
  base64: string;
}
export class imgVO {
  constructor() { }
}

export interface PermisoVO {
  id: number;
  name: string;
  descrip: string;
  code: string;
  estado: boolean;

  showAtributeOption: boolean;
}
export class PermisoVO {
  constructor() {
    this.name = '';
    this.descrip = '';
    this.code = '';

    this.showAtributeOption = true;
  }
}

export interface RoleVO {
  id: number;
  name: string;
  descrip: string;
  code: string;
  estado: boolean;
  permisos: PermisoVO[];
  permisosDisponibeles: PermisoVO[];
  addRol: boolean;
  addPermisos: boolean;

  showAtributeOption: boolean;
  idSelectedPermiso: string;
}
export class RoleVO {
  constructor() {
    this.name = '';
    this.descrip = '';
    this.code = '';
    this.addPermisos = false;

    this.showAtributeOption = true;
    this.idSelectedPermiso = '';
  }
}

// ################################################ //
// ############ Request SEccton ################### //
// ################################################ //

export interface PaginRequestVO {
  limit: number;
  pageSize: number;
}
export class PaginRequestVO {
  constructor() { }
}

export interface ComunasRequestVO extends PaginRequestVO {
  codigo: string;// Nombres
  descrip: string;// Descripción
}
export class ComunasRequestVO {
  constructor() {
    this.codigo = '';
    this.pageSize = 1;
    this.limit = 10;
  }
}

export interface KapmaeRequestVO extends PaginRequestVO {
  rut_cop: string;// Rut Socio	
  nombres: string;// Nombres
  ape_pat: string;// Apellido Paterno
  ape_mat: string;// Apellido Materno
  cod_cop: number;// Código Luzagro
  sec_cop: number;// Sector
  com_pos: number;// Comuna
}
export class KapmaeRequestVO {
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

export interface SectoresRequestVO extends PaginRequestVO {
  codigo: string;// Nombres
  descrip: string;// Descripción
}
export class SectoresRequestVO {
  constructor() {
    this.codigo = '';
    this.pageSize = 1;
    this.limit = 10;
  }
}

export interface PermisosRequestVO extends PaginRequestVO {
  name: string;// Nombres
}
export class PermisosRequestVO {
  constructor() {
    this.name = '';
    this.pageSize = 1;
    this.limit = 10;
  }
}

export interface UsuariosRequestVO extends PaginRequestVO {
  ctaUserName: string;// Nombre
  ctaEmail: string;// Correo
}
export class UsuariosRequestVO {
  constructor() {
    this.ctaUserName = '';
    this.ctaEmail = '';
    this.pageSize = 1;
    this.limit = 10;
  }
}

export interface RolesRequestVO extends PaginRequestVO {
  name: string;// Nombres
}
export class RolesRequestVO {
  constructor() {
    this.name = '';
    this.pageSize = 1;
    this.limit = 10;
  }
}
