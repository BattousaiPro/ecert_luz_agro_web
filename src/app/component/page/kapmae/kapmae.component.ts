import { Component } from '@angular/core';
import { DataSocio, DatepickerModel } from './model/DataSocio';
import { DetailSocioComponent } from './detail-socio/detail-socio.component';
import { SpinnerComponent } from '../../utilitarios/spinner/spinner.component';
import { NgbModal, NgbPaginationModule, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KapmaeService } from '../../../services/kapmae/kapmae.service';
import { ModalOptions } from '../../../utils/modalOptions';
import { KapmaeRequest } from './model/KapmaeRequest';
import { SectorService } from '../../../services/sector/sector.service';
import { ComunasService } from '../../../services/comunas/comunas.service';
import { Sector } from '../sectores/sectores.component';
import { Comunas } from '../comunas/comunas.component';

@Component({
  selector: 'app-kapmae',
  standalone: true,
  imports: [FormsModule,
    DetailSocioComponent,
    SpinnerComponent,
    CommonModule,
    NgbPaginationModule,
    NgbInputDatepicker,
  ],
  templateUrl: './kapmae.component.html',
  styleUrl: './kapmae.component.scss'
})
export class KapmaeComponent {

  sectores: Sector[] = [];
  comunas: Comunas[] = [];;

  socios: DataSocio[] = [];
  socioModal: DataSocio = new DataSocio();
  socioDeleteModal: DataSocio = new DataSocio();
  currentItem: DataSocio = new DataSocio();
  req: KapmaeRequest = new KapmaeRequest();

  cargar: boolean = false;
  isEdit: boolean = false;
  modals = new ModalOptions();
  collectionSize: number = 0;

  principalContainer: boolean = true;
  erroresNewEdit: string[] = [];

  constructor(private modalService: NgbModal,
    private kapmaeService: KapmaeService,
    private sectorService: SectorService,
    private comunasService: ComunasService,
  ) {
    this.loadCargar();
  }

  public loadCargar(): void {
    console.log('Cargando loadCargar');
    this.cargar = true;
    this.kapmaeService.obtenerByFilter(this.req).subscribe(
      (data: any) => {
        // console.log(JSON.stringify(data));
        if (data.code === '0'
          && data.data != null
          && data.data.results != null) {
          this.socios = [];
          this.socios.push(...data.data.results);
          //this.socios.push(...listaSocios);
          this.collectionSize = data.data.totalReg;
          for (let index = 0; index < this.socios.length; index++) {
            this.socios[index].selected = false;
          }
          this.loadCargarSector();
        } else {
          this.cargar = false;
          this.modals.error('Error con el servicio de Socios');
        }
      },
      (err: any) => {
        this.modals.error('Error con el servicio de Socios');
        this.cargar = false;
      });
  }

  public loadCargarSector(): void {
    console.log('Cargando loadCargarSector');
    this.cargar = true;
    this.sectorService.getAll().subscribe(
      (data: any) => {
        if (data.code === '0'
          && data.data != null) {
          this.closeModal();
          this.sectores = [];
          this.sectores.push(...data.data);
          this.loadCargarComunas();
        } else {
          this.cargar = false;
          this.modals.success('Error con la respuesta de servicios de Roles');
        }
      },
      (err: any) => {
        this.modals.error('Error con el servicio de Roles');
        this.cargar = false;
      }
    );
  }

  public loadCargarComunas(): void {
    console.log('Cargando loadCargarComunas');
    this.cargar = true;
    this.comunasService.getAll().subscribe(
      (data: any) => {
        if (data.code === '0'
          && data.data != null) {
          this.closeModal();
          this.comunas = [];
          this.comunas.push(...data.data);
        } else {
          this.modals.success('Error con la respuesta de servicios de Roles');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.modals.error('Error con el servicio de Roles');
        this.cargar = false;
      }
    );
  }

  statusChange(socio: DataSocio, id: string = '') {
    console.log('Method cambioEstado.');
    if (id === '') {
      socio.selected = !socio.selected;
      for (let index = 0; index < this.socios.length; index++) {
        if (!(this.socios[index].rut_cop === socio.rut_cop && this.socios[index].cod_cop === socio.cod_cop)) {
          this.socios[index].selected = false;
        }
      }
    }
  }

  openDetails(socio: DataSocio, content: any) {
    console.log('Method openDetails.');
    this.socioModal = socio;
    this.openModalFunction(content);
  }

  validaSelected(): boolean {
    for (let index = 0; index < this.socios.length; index++) {
      if (this.socios[index].selected) {
        return true;
      }
    }
    console.log('return false.');
    return false;
  }

  seleccionar() {
    if (!this.validaSelected()) {
      this.modals.warning('debes seleccionar un Socio');
    } else {
      this.modals.info('Funcionalidad No disponible');
    }
  }

  cerfificado() {
    if (!this.validaSelected()) {
      this.modals.warning('debes seleccionar un Socio para cerfificado');
    } else {
      this.modals.info('Funcionalidad No disponible');
    }
  }

  openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  /********************************************************/
  // Sector de filtros
  public buscarByCodigo(): void {
    console.log('Method buscarByCodigo');
  }

  public buscarBySector(): void {
    console.log('Method buscarBySector');
  }
  /********************************************************/

  public delete(): void {
    console.log('Cargando delete');
    this.cargar = true;
    this.kapmaeService.delete(this.socioDeleteModal.rut_cop, this.socioDeleteModal.cod_cop).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de eliminar Sectotes');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de eliminar Sectotes');
        this.cargar = false;
      });
  }

  public edit(): void {
    console.log('Cargando delete');
    this.cargar = true;
    this.kapmaeService.edit(this.socioModal).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de eliminar Sectotes');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de eliminar Sectotes');
        this.cargar = false;
      });
  }

  public new(): void {
    console.log('Cargando delete');
    this.cargar = true;
    this.kapmaeService.new(this.socioModal).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de eliminar Sectotes');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de eliminar Sectotes');
        this.cargar = false;
      });
  }

  public deleteModal(content: any, selectedItem: DataSocio): void {
    console.log('Method deleteModal');
    this.socioDeleteModal = JSON.parse(JSON.stringify(selectedItem));
    this.openModalFunction(content);
  }

  public editarModal(selectedItem: DataSocio): void {
    console.log('Method editarModal');
    this.socioModal = JSON.parse(JSON.stringify(selectedItem));
    this.currentItem = JSON.parse(JSON.stringify(selectedItem));
    this.isEdit = true;
    this.principalContainer = false;
  }

  public agregaModal(): void {
    console.log('Method agregaModal.');
    this.socioModal = new DataSocio();
    this.isEdit = false;
    this.principalContainer = false;
  }

  public guardar(selectedItem: DataSocio): void {
    if (this.validateActionNewEdit(selectedItem)) {
      if (this.isEdit) {
        this.edit();
      } else {
        this.new();
      }
    } else {
      this.modals.info('Algunos de los campos no se ingreso correctamente');
      console.log('errores: ' + JSON.stringify(this.erroresNewEdit));
    }
  }

  public volverDetalle(): void {
    this.principalContainer = true;
  }

  public validateActionNewEdit(selectedItem: DataSocio): boolean {
    // TODO: validar cada uno de los campos.
    this.erroresNewEdit = [];
    // Campo: Rut Socio
    if (typeof this.socioModal.rut_cop !== 'undefined') {
      this.erroresNewEdit.push('Error con rut_cop');
    }

    // Campo: Nombres
    if (typeof this.socioModal.nombres !== 'undefined') {
      this.erroresNewEdit.push('Error con nombres');
    }

    // Campo: Apellido Paterno
    if (typeof this.socioModal.ape_pat !== 'undefined') {
      this.erroresNewEdit.push('Error con ape_pat');
    }

    // Campo: Apellido Materno
    if (typeof this.socioModal.ape_mat !== 'undefined') {
      this.erroresNewEdit.push('Error con ape_mat');
    }

    // Campo: Código Luzagro
    if (typeof this.socioModal.cod_cop !== 'undefined') {
      this.erroresNewEdit.push('Error con cod_cop');
    }

    // Campo: Código Luzlinares
    if (typeof this.socioModal.cod_lli !== 'undefined') {
      this.erroresNewEdit.push('Error con cod_lli');
    }

    // Campo: Código Anterior
    if (typeof this.socioModal.cod_ant !== 'undefined') {
      this.erroresNewEdit.push('Error con cod_ant');
    }

    // Campo: Código Nuevo
    if (typeof this.socioModal.cod_nvo !== 'undefined') {
      this.erroresNewEdit.push('Error con cod_nvo');
    }

    // Campo: Código Original
    if (typeof this.socioModal.cod_ori !== 'undefined') {
      this.erroresNewEdit.push('Error con cod_ori');
    }

    // Campo: Sector
    if (typeof this.socioModal.sec_cop !== 'undefined') {
      this.erroresNewEdit.push('Error con sec_cop');
    }

    // Campo: Año Inscripción
    if (typeof this.socioModal.ano_inc !== 'undefined') {
      this.erroresNewEdit.push('Error con ano_inc');
    }

    // Campo: Monto Inscripción
    if (typeof this.socioModal.mto_inc !== 'undefined') {
      this.erroresNewEdit.push('Error con mto_inc');
    }

    // Campo: Fecha Inscripción
    if (this.validateFormatDate(this.socioModal.fec_inc_date)) {
      this.erroresNewEdit.push('Error con fec_inc');
    }
    /*if (typeof this.socioModal.fec_inc !== 'undefined') {
      this.erroresNewEdit.push('Error con fec_inc');
    }

    // Campo: Fecha Inscripción
    if (typeof this.socioModal.fec_inc_date !== 'undefined') {
      this.erroresNewEdit.push('Error con fec_inc_date');
    }*/

    // Campo: Año Traspaso
    if (typeof this.socioModal.ano_tra !== 'undefined') {
      this.erroresNewEdit.push('Error con ano_tra');
    }

    // Campo: Capital Traspaso
    if (typeof this.socioModal.kap_tra !== 'undefined') {
      this.erroresNewEdit.push('Error con kap_tra');
    }

    // Campo: Fecha Traspaso
    if (this.validateFormatDate(this.socioModal.fec_tra_date)) {
      this.erroresNewEdit.push('Error con fec_tra');
    }
    /*if (typeof this.socioModal.fec_tra !== 'undefined') {
      this.erroresNewEdit.push('Error con fec_tra');
    }

    // Campo: Fecha Traspaso
    if (typeof this.socioModal.fec_tra_date !== 'undefined') {
      this.erroresNewEdit.push('Error con fec_tra_date');
    }*/

    // Campo: Acciones Traspaso
    if (typeof this.socioModal.acc_tra !== 'undefined') {
      this.erroresNewEdit.push('Error con acc_tra');
    }

    // Campo: Acciones Retiro
    if (typeof this.socioModal.acc_ret !== 'undefined') {
      this.erroresNewEdit.push('Error con acc_ret');
    }

    // Campo: Acciones Aporte
    if (typeof this.socioModal.acc_apo !== 'undefined') {
      this.erroresNewEdit.push('Error con acc_apo');
    }

    // Campo: Actualización
    if (this.validateFormatDate(this.socioModal.fec_act_date)) {
      this.erroresNewEdit.push('Error con fec_act');
    }
    /*if (typeof this.socioModal.fec_act !== 'undefined') {
      this.erroresNewEdit.push('Error con fec_act');
    }

    // Campo: Actualización
    if (typeof this.socioModal.fec_act_date !== 'undefined') {
      this.erroresNewEdit.push('Error con fec_act_date');
    }*/

    // Campo: ">Estado Traspao
    if (typeof this.socioModal.est_tra !== 'undefined') {
      this.erroresNewEdit.push('Error con est_tra');
    }

    // Campo: ">Estado del Bono
    if (typeof this.socioModal.est_bon !== 'undefined') {
      this.erroresNewEdit.push('Error con est_bon');
    }

    // Campo: ">Dirección Postal
    if (typeof this.socioModal.dir_pos !== 'undefined') {
      this.erroresNewEdit.push('Error con dir_pos');
    }

    // Campo: Nro Teléfono 1
    if (typeof this.socioModal.nro_te1 !== 'undefined') {
      this.erroresNewEdit.push('Error con nro_te1');
    }

    // Campo: Nro Teléfono 2
    if (typeof this.socioModal.nro_te2 !== 'undefined') {
      this.erroresNewEdit.push('Error con nro_te2');
    }

    // Campo: Nro Teléfono 3
    if (typeof this.socioModal.nro_te3 !== 'undefined') {
      this.erroresNewEdit.push('Error con nro_te3');
    }

    // Campo: Nro Teléfono 4
    if (typeof this.socioModal.nro_te4 !== 'undefined') {
      this.erroresNewEdit.push('Error con nro_te4');
    }

    // Campo: Comuna
    if (typeof this.socioModal.com_pos !== 'undefined') {
      this.erroresNewEdit.push('Error con com_pos');
    }


    // Campo: Observación
    if (typeof this.socioModal.obs_cap !== 'undefined') {
      this.erroresNewEdit.push('Error con obs_cap');
    }

    // ************************************************************************************************
    // Campos ocultro en la tabla de socios.
    // Campo: nro_sol
    if (typeof this.socioModal.nro_sol !== 'undefined') {
      this.erroresNewEdit.push('Error con nro_sol');
    }

    // Campo: fec_sol
    if (this.validateFormatDate(this.socioModal.fec_sol_date)) {
      this.erroresNewEdit.push('Error con fec_sol');
    }
    /*if (typeof this.socioModal.fec_sol !== 'undefined') {
      this.erroresNewEdit.push('Error con fec_sol');
    }

    // Campo: fec_sol
    /*if (typeof this.socioModal.fec_sol_date !== 'undefined') {
      this.erroresNewEdit.push('Error con fec_sol_date');
    }*/

    // Campo: fec_apr
    if (this.validateFormatDate(this.socioModal.fec_apr_date)) {
      this.erroresNewEdit.push('Error con fec_apr');
    }
    /*if (typeof this.socioModal.fec_apr !== 'undefined') {
      this.erroresNewEdit.push('Error con fec_apr');
    }

    // Campo: fec_apr
    /*if (typeof this.socioModal.fec_apr_date !== 'undefined') {
      this.erroresNewEdit.push('Error con fec_apr_date');
    }*/

    // Campo: fec_can
    if (this.validateFormatDate(this.socioModal.fec_can_date)) {
      this.erroresNewEdit.push('Error con fec_can');
    }
    /*if (typeof this.socioModal.fec_can !== 'undefined') {
      this.erroresNewEdit.push('Error con fec_can');
    }

    // Campo: fec_can
    /*if (typeof this.socioModal.fec_can_date !== 'undefined') {
      this.erroresNewEdit.push('Error con fec_can_date');
    }*/

    // Campo: est_sol 
    if (typeof this.socioModal.est_sol !== 'undefined') {
      this.erroresNewEdit.push('Error con est_sol');
    }

    // Campo: sec_cte 
    if (typeof this.socioModal.sec_cte !== 'undefined') {
      this.erroresNewEdit.push('Error con sec_cte');
    }

    // Campo: area 
    if (typeof this.socioModal.area !== 'undefined') {
      this.erroresNewEdit.push('Error con area');
    }

    // Campo: sec_imp 
    if (typeof this.socioModal.sec_imp !== 'undefined') {
      this.erroresNewEdit.push('Error con sec_imp');
    }

    // Campo: est_reg 
    if (typeof this.socioModal.est_reg !== 'undefined') {
      this.erroresNewEdit.push('Error con est_reg');
    }

    // Campo: acc_con 
    if (typeof this.socioModal.acc_con !== 'undefined') {
      this.erroresNewEdit.push('Error con acc_con');
    }

    // Campo: aju_acc 
    if (typeof this.socioModal.aju_acc !== 'undefined') {
      this.erroresNewEdit.push('Error con aju_acc');
    }
    if (this.erroresNewEdit.length > 0) {
      return false;
    }
    return true;
  }

  private validateFormatDate(inputDate: DatepickerModel | undefined): boolean {
    /*
    if (typeof this.socioModal.fec_inc !== 'undefined') {
      this.erroresNewEdit.push('Error con fec_inc');
      return false;
    }
    */
    return true;
  }

}
