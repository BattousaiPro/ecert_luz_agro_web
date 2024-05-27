export interface DataSocio {
  id?: any;
  rut_cop?: any;
  ape_pat?: any;
  ape_mat?: any;
  nombres?: any;
  cod_cop?: any;
  cod_lli?: any;
  cod_ant?: any;
  cod_nvo?: any;
  cod_ori?: any;
  //sec_cop?: any;
  sector?: any;
  ano_inc?: any;
  mto_inc?: any;
  fec_inc?: any;
  ano_tra?: any;
  kap_tra?: any;
  fec_tra?: any;
  acc_tra?: any;
  acc_ret?: any;
  acc_apo?: any;
  fec_act?: any;
  est_tra?: any;
  est_bon?: any;
  dir_pos?: any;
  nro_te1?: any;
  nro_te2?: any;
  nro_te3?: any;
  nro_te4?: any;
  //com_pos?: any;
  comuna?: any;
  obs_cap?: any;
  nro_sol?: any;
  fec_sol?: any;
  fec_apr?: any;
  fec_can?: any;
  est_sol?: any;
  sec_cte?: any;
  area?: any;
  sec_imp?: any;
  est_reg?: any;
  acc_con?: any;
  aju_acc?: any;
  selected?: boolean;
}

export class DataSocio {
  constructor() {
    this.selected = false;

  }
}
