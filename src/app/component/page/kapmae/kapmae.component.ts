import { Component, OnInit } from '@angular/core';
import { DataSocio, DatepickerModel } from './model/DataSocio';
import { DetailSocioComponent } from './detail-socio/detail-socio.component';
import { SpinnerComponent } from '../../utilitarios/spinner/spinner.component';
import { NgbModal, NgbPaginationModule, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KapmaeService, ReqImg } from '../../../services/kapmae/kapmae.service';
import { ModalOptions } from '../../../utils/modalOptions';
import { KapmaeRequest } from './model/KapmaeRequest';
import { SectorService } from '../../../services/sector/sector.service';
import { ComunasService } from '../../../services/comunas/comunas.service';
import { Sector } from '../sectores/sectores.component';
import { Comunas } from '../comunas/comunas.component';
import { Utility } from '../../../utils/utility';

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
export class KapmaeComponent implements OnInit {

  sectores: Sector[] = [];
  comunas: Comunas[] = [];

  docsImg: DocumentosImg = new DocumentosImg();
  // listaImagenes: ImgLista[] = [];
  showBoton: boolean = false;

  socios: DataSocio[] = [];
  socioModal: DataSocio = new DataSocio();
  socioSelectImgModal: DataSocio = new DataSocio();
  socioDeleteModal: DataSocio = new DataSocio();
  currentItem: DataSocio = new DataSocio();
  req: KapmaeRequest = new KapmaeRequest();

  cargar: boolean = false;
  isEdit: boolean = false;
  selectedAll: boolean = false;
  modals = new ModalOptions();
  collectionSize: number = 0;

  principalContainer: boolean = true;
  erroresNewEdit: string[] = [];

  public utility = new Utility;
  isPermisoVerLista: boolean = false;
  isPermisoCreate: boolean = false;
  isPermisoDelete: boolean = false;
  isPermisoEdit: boolean = false;
  isPermisoSeleccionar: boolean = false;
  isPermisoCertificado: boolean = false;

  constructor(private modalService: NgbModal,
    private kapmaeService: KapmaeService,
    private sectorService: SectorService,
    private comunasService: ComunasService,
  ) { }

  ngOnInit(): void {
    this.docsImg.imagenes = [];
    this.setPermiso();
    if (this.isPermisoVerLista)
      this.loadCargar();
  }

  public selectedMethod(): void {
    this.selectedAll = !this.selectedAll;
    for (let index = 0; index < this.docsImg.imagenes.length; index++) {
      this.docsImg.imagenes[index].estado = this.selectedAll;
    }
  }

  private setPermiso(): void {
    this.isPermisoVerLista = this.utility.consultar('LUZ_AGRO_MENU_SOCIO');
    this.isPermisoDelete = this.utility.consultar('LUZ_AGRO_SOCIO_DELETE');
    this.isPermisoEdit = this.utility.consultar('LUZ_AGRO_SOCIO_EDIT');
    this.isPermisoCreate = this.utility.consultar('LUZ_AGRO_SOCIO_CREATE');
    this.isPermisoSeleccionar = this.utility.consultar('LUZ_AGRO_SOCIO_SELECCIONAR');
    this.isPermisoCertificado = this.utility.consultar('LUZ_AGRO_SOCIO_CERTIFICADO');
  }

  public loadCargarImg(content: any): void {
    this.cargar = true;
    let codCop = this.socioSelectImgModal.cod_cop;
    this.kapmaeService.findImgByCodCop(codCop).subscribe(
      (data: any) => {
        // console.log(JSON.stringify(data));
        if (data.code === '0'
          && data.data != null) {
          this.showBoton = false;
          this.docsImg.imagenes = [];
          if (typeof data.data.imgs !== 'undefined') {
            for (let index = 0; index < data.data.imgs.length; index++) {
              let img: ImgLista = new ImgLista();
              img.imagen = data.data.imgs[index];
              img.estado = false;
              this.docsImg.imagenes.push(img);
            }
            if (this.docsImg.imagenes.length > 0) {
              this.showBoton = true;
            }
            this.docsImg.imagenes.sort();
            this.docsImg.basePath = data.data.basepath;
          }
          this.openModalFunction(content);
        } else {
          this.modals.error('Error con el Obtener Imágenes');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.modals.error('Error con el Obtener Imágenes');
        this.cargar = false;
      });
  }

  public loadCargar(): void {
    console.log('Cargando loadCargar');
    this.cargar = true;
    this.req.clear();
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
          this.modals.error('Error con la respuesta de servicios de Sectores');
        }
      },
      (err: any) => {
        this.modals.error('Error con el servicio de Sectores');
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
          this.modals.error('Error con la respuesta de servicios de Comunas');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.modals.error('Error con el servicio de Comunas');
        this.cargar = false;
      }
    );
  }

  public statusChange(socio: DataSocio, id: string = ''): void {
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

  public openDetails(socio: DataSocio, content: any): void {
    console.log('Method openDetails.');
    this.socioModal = socio;
    this.openModalFunction(content);
  }

  private validaSelected(): DataSocio | null {
    for (let index = 0; index < this.socios.length; index++) {
      if (this.socios[index].selected) {
        return this.socios[index];
      }
    }
    console.log('return false.');
    return null;
  }

  public seleccionar(content: any): void {
    let selectItem = this.validaSelected();
    if (selectItem == null) {
      this.modals.warning('debes seleccionar un Socio');
    } else {
      this.socioSelectImgModal = JSON.parse(JSON.stringify(selectItem));
      this.loadCargarImg(content);
    }
  }

  public cerfificado(): void {
    let selectItem = this.validaSelected();
    if (selectItem == null) {
      this.modals.warning('debes seleccionar un Socio para cerfificado');
    } else {
      this.modals.info('Funcionalidad No disponible');
    }
  }

  public imprimirImg(): void {
    let habilitadosList: ReqImg = this.obtenerListaHabilitados();
    // this.impromirPdfImagens(habilitadosList);
    this.modals.info('Funcionalidad No disponible');
  }

  private obtenerListaHabilitados(): ReqImg {
    const imgHabilitados: ReqImg = new ReqImg();
    imgHabilitados.imgs = [];
    for (let index = 0; index < this.docsImg.imagenes.length; index++) {
      const element = this.docsImg.imagenes[index];
      if (element.estado) {
        imgHabilitados.imgs.push(element.imagen.pathImg);
      }
    }
    return imgHabilitados;
  }

  private impromirPdfImagens(imgHabilitados: ReqImg): void {
    console.log('Method impromirPdfImagens');
    this.cargar = true;
    this.kapmaeService.impromirPdfImagens(imgHabilitados).subscribe(
      (data: any) => {
        if (data.code === '0') {
          let dat = new Date();
          let fileName = 'imagenes_codeSocio_';
          const linkSource = 'data:application/pdf;base64,' + data.data;

          const downloadLink = document.createElement('a');
          downloadLink.href = linkSource;
          fileName = fileName + '_' + dat.getDate() + '_' + (dat.getMonth() + 1) + '_'
            + dat.getFullYear() + '_' + dat.getHours() + '_' + dat.getMinutes() + '.pdf';
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          this.modals.error('Error con la respuesta de servicios de obtener Pdf Con Imagenes');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de obtener Pdf Con Imagenes');
        this.cargar = false;
      });
  }

  public openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  public closeModal(): void {
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

  public new(): void {
    console.log('Cargando delete');
    this.cargar = true;
    this.kapmaeService.new(this.socioModal).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.modals.success('Socio Creado Con Éxito!');
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
          this.modals.success('Socio Modificado Con Éxito!');
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

  public delete(): void {
    console.log('Cargando delete');
    this.cargar = true;
    this.kapmaeService.delete(this.socioDeleteModal.rut_cop, this.socioDeleteModal.cod_cop).subscribe(
      (data: any) => {
        if (data.code === '0') {
          this.closeModal();
          this.modals.success('Socio Eliminado Con Éxito!');
          this.loadCargar();
        } else {
          this.modals.error('Error con la respuesta de servicios de eliminar Socio');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de eliminar Socio');
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
    console.log('Method guardar.');
    if (this.isEdit) {
      if (this.validateActionEdit(selectedItem)) {
        // this.edit();
        this.modals.info('Funcionalidad Editar Socios No disponible');
      } else {
        this.showErrorNewEdit();
      }
    } else {
      if (this.validateActionNew()) {
        // this.new();
        this.modals.info('Funcionalidad Crear Socios No disponible');
      } else {
        this.showErrorNewEdit();
      }
    }
  }

  private showErrorNewEdit(): void {
    this.modals.info('Algunos de los campos no se ingreso correctamente, [' + this.erroresNewEdit.length + '] Errores');
    for (let index = 0; index < this.erroresNewEdit.length; index++) {
      const element = this.erroresNewEdit[index];
      console.log('error[' + index + ']: ' + element);
    }
  }

  public volverDetalle(): void {
    this.principalContainer = true;
  }

  public validateActionNew(): boolean {
    /* Campos Opcionales, TODO: cambiar validación de obligtorio.
      -> Dirección Postal *
      -> Nro Teléfono 1 *
      -> Nro Teléfono 2 *
      -> Nro Teléfono 3 *
      -> Nro Teléfono 4 *
      -> nro_sol *
      -> fec_sol
      -> fec_apr
      -> fec_can
      -> est_sol
      -> sec_cte
      -> area
      -> sec_imp
      -> est_reg
      -> acc_con
      -> aju_acc
    */
    // TODO: validar cada uno de los campos.
    this.erroresNewEdit = [];

    // Campo: Rut Socio
    if (typeof this.socioModal.rut_cop === 'undefined' || this.socioModal.rut_cop === '') {
      //distinto de vacio o indefinido.
      this.erroresNewEdit.push('Error con rut_cop -> Rut Socio');
    }

    // Campo: Nombres
    if (typeof this.socioModal.nombres === 'undefined' || this.socioModal.nombres === '') {
      //distinto de vacio o indefinido.
      this.erroresNewEdit.push('Error con nombres -> Nombres');
    }

    // Campo: Apellido Paterno
    if (typeof this.socioModal.ape_pat === 'undefined' || this.socioModal.ape_pat === '') {
      //distinto de vacio o indefinido.
      this.erroresNewEdit.push('Error con ape_pat -> Apellido Paterno');
    }

    // Campo: Apellido Materno
    if (typeof this.socioModal.ape_mat === 'undefined' || this.socioModal.ape_mat === '') {
      //distinto de vacio o indefinido.
      this.erroresNewEdit.push('Error con ape_mat -> Apellido Materno');
    }

    // Campo: Código Luzagro
    if (typeof this.socioModal.cod_cop === 'undefined' || this.socioModal.cod_cop < 0) {
      //distinto de vacio o indefinido.
      this.erroresNewEdit.push('Error con cod_cop -> Código Luzagro');
    }

    // Campo: Código Luzlinares
    if (typeof this.socioModal.cod_lli === 'undefined' || this.socioModal.cod_lli < 0) {
      //distinto de vacio o indefinido.
      this.erroresNewEdit.push('Error con cod_lli -> Código Luzlinares');
    }

    // Campo: Código Anterior
    if (typeof this.socioModal.cod_ant === 'undefined' || this.socioModal.cod_ant < 0) {
      //distinto de vacio o indefinido.
      this.erroresNewEdit.push('Error con cod_ant -> Código Anterior');
    }

    // Campo: Código Nuevo
    if (typeof this.socioModal.cod_nvo === 'undefined' || this.socioModal.cod_nvo < 0) {
      //distinto de vacio o indefinido.
      this.erroresNewEdit.push('Error con cod_nvo -> Código Nuevo');
    }

    // Campo: Código Original
    if (typeof this.socioModal.cod_ori === 'undefined' || this.socioModal.cod_ori < 0) {
      //distinto de vacio o indefinido.
      this.erroresNewEdit.push('Error con cod_ori -> Código Original');
    }

    // Campo: Sector
    if (typeof this.socioModal.sec_cop === 'undefined') {
      //distinto de vacio o indefinido.
      this.erroresNewEdit.push('Error con sec_cop -> Sector');
    }

    // Campo: Año Inscripción
    if (typeof this.socioModal.ano_inc === 'undefined' || this.socioModal.ano_inc < 0) {
      //distinto de vacio o indefinido.
      this.erroresNewEdit.push('Error con ano_inc -> Año Inscripción');
    }

    // Campo: Monto Inscripción
    if (typeof this.socioModal.mto_inc === 'undefined' || this.socioModal.mto_inc < 0) {
      this.erroresNewEdit.push('Error con mto_inc -> Monto Inscripción');
    }

    // Campo: Fecha Inscripción
    if (!this.validateFormatDate(this.socioModal.fec_inc_date)) {
      this.erroresNewEdit.push('Error con fec_inc -> Fecha Inscripción');
    }

    // Campo: Año Traspaso
    if (typeof this.socioModal.ano_tra === 'undefined' || this.socioModal.ano_tra < 0) {
      this.erroresNewEdit.push('Error con ano_tra -> Año Traspaso');
    }

    // Campo: Capital Traspaso
    if (typeof this.socioModal.kap_tra === 'undefined' || this.socioModal.kap_tra < 0) {
      this.erroresNewEdit.push('Error con kap_tra -> Capital Traspaso');
    }

    // Campo: Fecha Traspaso
    if (!this.validateFormatDate(this.socioModal.fec_tra_date)) {
      this.erroresNewEdit.push('Error con fec_tra -> Fecha Traspaso');
    }

    // Campo: Acciones Traspaso
    if (typeof this.socioModal.acc_tra === 'undefined' || this.socioModal.acc_tra < 0) {
      this.erroresNewEdit.push('Error con acc_tra -> Acciones Traspaso');
    }

    // Campo: Acciones Retiro
    if (typeof this.socioModal.acc_ret === 'undefined' || this.socioModal.acc_ret < 0) {
      this.erroresNewEdit.push('Error con acc_ret -> Acciones Retiro');
    }

    // Campo: Acciones Aporte
    if (typeof this.socioModal.acc_apo === 'undefined' || this.socioModal.acc_apo < 0) {
      this.erroresNewEdit.push('Error con acc_apo -> Acciones Aporte');
    }

    // Campo: Actualización
    if (!this.validateFormatDate(this.socioModal.fec_act_date)) {
      this.erroresNewEdit.push('Error con fec_act -> Actualización');
    }

    // Campo: Estado Traspao
    if (typeof this.socioModal.est_tra === 'undefined' || this.socioModal.est_tra === '') {
      this.erroresNewEdit.push('Error con est_tra -> Estado Traspao');
    }

    // Campo: Estado del Bono
    if (typeof this.socioModal.est_bon === 'undefined' || this.socioModal.est_bon < 0) {
      this.erroresNewEdit.push('Error con est_bon -> Estado del Bono');
    }

    // Campo: Dirección Postal
    if (typeof this.socioModal.dir_pos !== 'undefined') {
      // TODO: validar formato de ser requeido
      // this.erroresNewEdit.push('Error con dir_pos -> Dirección Postal');
    }

    // Campo: Nro Teléfono 1
    if (typeof this.socioModal.nro_te1 !== 'undefined') {
      // TODO: validar formato de ser requeido
      // this.erroresNewEdit.push('Error con nro_te1 -> Nro Teléfono 1');
    }

    // Campo: Nro Teléfono 2
    if (typeof this.socioModal.nro_te2 !== 'undefined') {
      // TODO: validar formato de ser requeido
      // this.erroresNewEdit.push('Error con nro_te2 -> Nro Teléfono 2');
    }

    // Campo: Nro Teléfono 3
    if (typeof this.socioModal.nro_te3 !== 'undefined') {
      // TODO: validar formato de ser requeido
      // this.erroresNewEdit.push('Error con nro_te3 -> Nro Teléfono 3');
    }

    // Campo: Nro Teléfono 4
    if (typeof this.socioModal.nro_te4 !== 'undefined') {
      // TODO: validar formato de ser requeido
      // this.erroresNewEdit.push('Error con nro_te4 -> Nro Teléfono 4');
    }

    // Campo: Comuna
    if (typeof this.socioModal.com_pos === 'undefined') {
      this.erroresNewEdit.push('Error con com_pos -> Comuna');
    }

    // Campo: Observación
    if (typeof this.socioModal.obs_cap === 'undefined') {
      this.erroresNewEdit.push('Error con obs_cap -> Observación');
    }

    // ************************************************************************************************
    // Campos ocultro en la tabla de socios.
    // Campo: nro_sol
    //if (typeof this.socioModal.nro_sol === 'undefined' || this.socioModal.nro_sol < 0) {
    if (typeof this.socioModal.nro_sol !== 'undefined') {
      // TODO: validar formato de ser requeido
      // this.erroresNewEdit.push('Error con nro_sol');
    }

    // Campo: fec_sol
    if (!this.validateFormatDate(this.socioModal.fec_sol_date)) {
      this.erroresNewEdit.push('Error con fec_sol');
    }

    // Campo: fec_apr
    if (!this.validateFormatDate(this.socioModal.fec_apr_date)) {
      this.erroresNewEdit.push('Error con fec_apr');
    }

    // Campo: fec_can
    if (!this.validateFormatDate(this.socioModal.fec_can_date)) {
      this.erroresNewEdit.push('Error con fec_can');
    }

    // Campo: est_sol 
    if (typeof this.socioModal.est_sol === 'undefined') {
      this.erroresNewEdit.push('Error con est_sol');
    }

    // Campo: sec_cte 
    if (typeof this.socioModal.sec_cte === 'undefined' || this.socioModal.sec_cte < 0) {
      this.erroresNewEdit.push('Error con sec_cte');
    }

    // Campo: area 
    if (typeof this.socioModal.area === 'undefined' || this.socioModal.area < 0) {
      this.erroresNewEdit.push('Error con area');
    }

    // Campo: sec_imp 
    if (typeof this.socioModal.sec_imp === 'undefined' || this.socioModal.sec_imp < 0) {
      this.erroresNewEdit.push('Error con sec_imp');
    }

    // Campo: est_reg 
    if (typeof this.socioModal.est_reg === 'undefined') {
      this.erroresNewEdit.push('Error con est_reg');
    }

    // Campo: acc_con 
    if (typeof this.socioModal.acc_con === 'undefined' || this.socioModal.acc_con < 0) {
      this.erroresNewEdit.push('Error con acc_con');
    }

    // Campo: aju_acc 
    if (typeof this.socioModal.aju_acc === 'undefined' || this.socioModal.aju_acc < 0) {
      this.erroresNewEdit.push('Error con aju_acc');
    }
    if (this.erroresNewEdit.length > 0) {
      return false;
    }
    return true;
  }

  public validateActionEdit(selectedItem: DataSocio): boolean {
    return true;
  }

  private validateFormatDate(inputDate: DatepickerModel | undefined): boolean {
    if (typeof inputDate === 'undefined') {
      return false;
    } else {
      if (typeof inputDate.year !== 'undefined' && typeof inputDate.month !== 'undefined' && typeof inputDate.day !== 'undefined') {
        return true;
      } else {
        return false;
      }
    }
  }

}

export interface DocumentosImg {
  imagenes: ImgLista[];
  basePath: string;
}
export class DocumentosImg {
  constructor() {
  }
}
export interface ImgLista {
  imagen: imgVO;
  estado: boolean;
}
export class ImgLista {
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