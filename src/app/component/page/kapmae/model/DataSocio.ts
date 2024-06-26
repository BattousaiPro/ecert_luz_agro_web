import { Comunas } from "../../comunas/comunas.component";
import { Sector } from "../../sectores/sectores.component";

export interface DataSocio {
  rut_cop: string;
  ape_pat?: string;
  ape_mat?: string;
  nombres?: string;
  cod_cop: number;
  cod_lli?: number;
  cod_ant?: number;
  cod_nvo?: number;
  cod_ori?: number;
  sec_cop?: Sector;
  ano_inc?: number;
  mto_inc?: number;
  fec_inc?: Date;
  fec_inc_date?: DatepickerModel;
  ano_tra?: number;
  kap_tra?: number;
  fec_tra?: Date;
  fec_tra_date?: DatepickerModel;
  acc_tra?: number;
  acc_ret?: number;
  acc_apo?: number;
  fec_act?: Date;
  fec_act_date?: DatepickerModel;
  est_tra?: string;
  est_bon?: number;
  dir_pos?: string;
  nro_te1?: string;
  nro_te2?: string;
  nro_te3?: string;
  nro_te4?: string;
  com_pos?: Comunas;
  obs_cap?: string;
  nro_sol?: number;
  fec_sol?: Date;
  fec_sol_date?: DatepickerModel;
  fec_apr?: Date;
  fec_apr_date?: DatepickerModel;
  fec_can?: Date;
  fec_can_date?: DatepickerModel;
  est_sol?: string;
  sec_cte?: number;
  area?: number;
  sec_imp?: number;
  est_reg?: string;
  acc_con?: number;
  aju_acc?: number;
  selected?: boolean;
}

export class DataSocio {
  constructor() {
    this.selected = false;
  }
}

export interface DatepickerModel {
  year?: number;
  month?: number;
  day?: number;
}

export class DatepickerModel {
  constructor() {
  }
}