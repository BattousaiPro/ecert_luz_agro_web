import { Component, OnInit } from '@angular/core';
import { DetailSocioComponent } from './detail-socio/detail-socio.component';
import { SpinnerComponent } from '../../utilitarios/spinner/spinner.component';
import { NgbModal, NgbPaginationModule, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KapmaeService, ReqCertificado, ReqImg } from '../../../services/kapmae/kapmae.service';
import { ModalOptions } from '../../../utils/modalOptions';
import { SectorService } from '../../../services/sector/sector.service';
import { ComunasService } from '../../../services/comunas/comunas.service';
import { Utility } from '../../../utils/utility';
import { ComunasVO, DataSocioVO, DatepickerModelVO, DocumentosImgVO, ImgListaVO, KapmaeRequestVO, SectorVO } from '../../../utils/modelsVos';
import { DeviceDetectorService } from 'ngx-device-detector';

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

  sectores: SectorVO[] = [];
  comunas: ComunasVO[] = [];

  docsImg: DocumentosImgVO = new DocumentosImgVO();
  // listaImagenes: ImgLista[] = [];
  showBoton: boolean = false;

  socios: DataSocioVO[] = [];
  socioModal: DataSocioVO = new DataSocioVO();
  socioSelectTable: DataSocioVO = new DataSocioVO();
  socioDeleteModal: DataSocioVO = new DataSocioVO();
  currentItem: DataSocioVO = new DataSocioVO();
  req: KapmaeRequestVO = new KapmaeRequestVO();

  cargar: boolean = false;
  isEdit: boolean = false;
  selectedAll: boolean = false;
  modals = new ModalOptions();
  collectionSize: number = 0;

  principalContainer: boolean = true;
  hashMapError = new Map<string, string>();
  browserDetected: string = '';

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
    private _deviceService: DeviceDetectorService,
  ) {
    this.browserDetected = this._deviceService.browser;
  }

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
    let codCop = this.socioSelectTable.cod_cop;
    this.kapmaeService.findImgByCodCop(codCop).subscribe(
      (data: any) => {
        // console.log(JSON.stringify(data));
        if (data.body.code === '0'
          && data.body.data != null) {
          this.showBoton = false;
          this.docsImg.imagenes = [];
          if (typeof data.body.data.imgs !== 'undefined') {
            for (let index = 0; index < data.body.data.imgs.length; index++) {
              let img: ImgListaVO = new ImgListaVO();
              img.imagen = data.body.data.imgs[index];
              img.estado = false;
              this.docsImg.imagenes.push(img);
            }
            if (this.docsImg.imagenes.length > 0) {
              this.showBoton = true;
            }
            this.docsImg.imagenes.sort();
            this.docsImg.basePath = data.body.data.basepath;
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
    this.kapmaeService.findByFilter(this.req).subscribe(
      (data: any) => {
        // console.log(JSON.stringify(data));
        if (data.body.code === '0'
          && data.body.data != null
          && data.body.data.results != null) {
          this.socios = [];
          this.socios.push(...data.body.data.results);
          this.collectionSize = data.body.data.totalReg;
          for (let index = 0; index < this.socios.length; index++) {
            this.socios[index].selected = false;
            this.socios[index].sec_cop_codigo = '';
            this.socios[index].com_pos_codigo = '';
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
        if (data.body.code === '0'
          && data.body.data != null) {
          this.closeModal();
          this.sectores = [];
          this.sectores.push(...data.body.data);
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
        if (data.body.code === '0'
          && data.body.data != null) {
          this.closeModal();
          this.comunas = [];
          this.comunas.push(...data.body.data);
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

  public statusChange(socio: DataSocioVO, id: string = ''): void {
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

  public openDetails(socio: DataSocioVO, content: any): void {
    console.log('Method openDetails.');
    this.socioModal = socio;
    this.openModalFunction(content);
  }

  private validaSelected(): DataSocioVO | null {
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
      this.socioSelectTable = JSON.parse(JSON.stringify(selectItem));
      this.loadCargarImg(content);
    }
  }

  public cerfificado(): void {
    let selectItem = this.validaSelected();
    if (selectItem == null) {
      this.modals.warning('debes seleccionar un Socio para obtener su cerfificado');
    } else {
      let reqCertificado: ReqCertificado = new ReqCertificado();
      reqCertificado.codCop = selectItem.cod_cop;
      reqCertificado.rutCop = selectItem.rut_cop;
      this.certificadoPdf(reqCertificado);
    }
  }

  public imprimirImg(rut_cop: string, cod_cop: number): void {
    let imgHabilitados: ReqImg = this.obtenerListaHabilitados();
    if (imgHabilitados.imgs.length > 0) {
      imgHabilitados.codCop = cod_cop;
      imgHabilitados.rutCop = rut_cop;
      this.impromirPdfImagens(imgHabilitados);
    } else {
      this.modals.info('Debe seleccionar a lo menos una Imagen.');
    }
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

  private certificadoPdf(reqCertificado: ReqCertificado): void {
    console.log('Method certificadoPdf');
    this.cargar = true;
    this.kapmaeService.certificadoPdf(reqCertificado).subscribe(
      (data: any) => {
        /*
        if (data.body.code === '22') {
          this.modals.info('Funcionalidad para la descarga de Certificado en desarrollo.');
        } else if (data.body.code === '20') {
          this.modals.info('! Certificado No Encontrado ¡');
        } else 
        */
          if (data.body.code === '0') {
            let fileName = this.utility.getFileName('certificado_' + reqCertificado.codCop + '_', '.pdf');
            this.utility.downloadPdfByBase64(fileName, data.body.data, this._deviceService.browser, this._deviceService.device);
          } else {
            this.modals.error('Error con la respuesta de servicios de obtener Pdf de Certificado');
          }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de obtener Pdf de Certificado');
        this.cargar = false;
      });
  }

  private impromirPdfImagens(imgHabilitados: ReqImg): void {
    console.log('Method impromirPdfImagens');
    this.cargar = true;
    this.kapmaeService.impromirPdfImagens(imgHabilitados).subscribe(
      (data: any) => {
        if (data.body.code === '0') {
          let fileName = this.utility.getFileName('imagenes_' + imgHabilitados.codCop + '_', '.pdf');
          this.utility.downloadPdfByBase64(fileName, data.body.data, this._deviceService.browser, this._deviceService.device);
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
        if (data.body.code === '0') {
          this.closeModal();
          this.modals.success('Socio Creado Con Éxito!');
          this.loadCargar();
          this.principalContainer = true;
        } else if (data.body.code === '-4') {
          this.modals.error('Socio ya existe (Rut Socio y Código Luzagro)');
        } else {
          this.modals.error('Error con la respuesta de servicios de agregar Socio');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de agregar Socio');
        this.cargar = false;
      });
  }

  public edit(): void {
    console.log('Cargando delete');
    this.cargar = true;
    this.kapmaeService.edit(this.socioModal).subscribe(
      (data: any) => {
        if (data.body.code === '0') {
          this.closeModal();
          this.modals.success('Socio Modificado Con Éxito!');
          this.loadCargar();
          this.principalContainer = true;
        } else if (data.body.code === '-3') {
          this.modals.error('Socio no existe (Rut Socio y Código Luzagro)');
        } else {
          this.modals.error('Error con la respuesta de servicios de editar Socio');
        }
        this.cargar = false;
      },
      (err: any) => {
        this.closeModal();
        this.modals.error('Error con el servicio de editar Socio');
        this.cargar = false;
      });
  }

  public delete(): void {
    console.log('Cargando delete');
    this.cargar = true;
    this.kapmaeService.delete(this.socioDeleteModal.rut_cop, this.socioDeleteModal.cod_cop).subscribe(
      (data: any) => {
        if (data.body.code === '0') {
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

  public deleteModal(content: any, selectedItem: DataSocioVO): void {
    console.log('Method deleteModal');
    this.socioDeleteModal = JSON.parse(JSON.stringify(selectedItem));
    this.openModalFunction(content);
  }

  public editarModal(selectedItem: DataSocioVO): void {
    console.log('Method editarModal');
    selectedItem.com_pos_codigo = '' + selectedItem.com_pos!.codigo;
    selectedItem.sec_cop_codigo = '' + selectedItem.sec_cop!.codigo;
    this.socioModal = JSON.parse(JSON.stringify(selectedItem));
    this.currentItem = JSON.parse(JSON.stringify(selectedItem));
    this.isEdit = true;
    this.setDateField();
    this.hashMapError.clear();
    this.principalContainer = false;
  }

  public agregaModal(): void {
    console.log('Method agregaModal.');
    this.socioModal = new DataSocioVO();
    this.isEdit = false;
    this.hashMapError.clear();
    this.principalContainer = false;
  }

  private formatDateInput(inputDate: Date) {
    let fecIncDate: Date = new Date(inputDate);
    return { 'year': fecIncDate.getFullYear(), 'month': (fecIncDate.getMonth() + 1), 'day': fecIncDate.getDate() };
  }

  private setDateField() {
    // let fecIncDateStg: string = fecIncDate.getFullYear() + '-' + (fecIncDate.getMonth() + 1) + '-' + fecIncDate.getDate() + 'T' + fecIncDate.getDay() + ':' + fecIncDate.getMinutes() + ':' + fecIncDate.getSeconds();
    if (typeof this.socioModal.fec_inc !== 'undefined' && this.socioModal.fec_inc !== null) {
      console.log('socioModal.fec_inc_date');
      this.socioModal.fec_inc_date = this.formatDateInput(this.socioModal.fec_inc);
    }
    if (typeof this.socioModal.fec_tra !== 'undefined' && this.socioModal.fec_tra !== null) {
      console.log('socioModal.fec_tra_date');
      this.socioModal.fec_tra_date = this.formatDateInput(this.socioModal.fec_tra);
    }
    if (typeof this.socioModal.fec_act !== 'undefined' && this.socioModal.fec_act !== null) {
      console.log('socioModal.fec_act_date');
      this.socioModal.fec_act_date = this.formatDateInput(this.socioModal.fec_act);
    }
    if (typeof this.socioModal.fec_sol !== 'undefined' && this.socioModal.fec_sol !== null) {
      console.log('socioModal.fec_sol_date');
      this.socioModal.fec_sol_date = this.formatDateInput(this.socioModal.fec_sol);
    }
    if (typeof this.socioModal.fec_apr !== 'undefined' && this.socioModal.fec_apr !== null) {
      console.log('socioModal.fec_apr_date');
      this.socioModal.fec_apr_date = this.formatDateInput(this.socioModal.fec_apr);
    }
    if (typeof this.socioModal.fec_can !== 'undefined' && this.socioModal.fec_can !== null) {
      console.log('socioModal.fec_can_date');
      this.socioModal.fec_can_date = this.formatDateInput(this.socioModal.fec_can);
    }
  }

  public guardar(): void {
    this.hashMapError.clear();
    this.validateNew();
    if (this.hashMapError.size === 0) {
      this.setAttrFecha();
      // console.log('this.socioModal: ' + JSON.stringify(this.socioModal));
      if (!this.isEdit) {
        console.log('this.new()');
        this.new();
      } else {
        console.log('this.edit()');
        this.edit();
      }
    }
  }

  private setAttrFecha(): void {
    this.socioModal.sec_cop = this.sectores.find((x: SectorVO) => ('' + x.codigo) === this.socioModal.sec_cop_codigo);
    this.socioModal.com_pos = this.comunas.find((x: ComunasVO) => ('' + x.codigo) === this.socioModal.com_pos_codigo);
    if (typeof this.socioModal.fec_inc_date != 'undefined') {
      this.socioModal.fec_inc = this.formatDateStg(this.socioModal.fec_inc_date);
    }
    if (typeof this.socioModal.fec_tra_date != 'undefined') {
      this.socioModal.fec_tra = this.formatDateStg(this.socioModal.fec_tra_date);
    }
    if (typeof this.socioModal.fec_act_date != 'undefined') {
      this.socioModal.fec_act = this.formatDateStg(this.socioModal.fec_act_date);
    }
    if (typeof this.socioModal.fec_sol_date != 'undefined') {
      this.socioModal.fec_sol = this.formatDateStg(this.socioModal.fec_sol_date);
    }
    if (typeof this.socioModal.fec_apr_date != 'undefined') {
      this.socioModal.fec_apr = this.formatDateStg(this.socioModal.fec_apr_date);
    }
    if (typeof this.socioModal.fec_can_date != 'undefined') {
      this.socioModal.fec_can = this.formatDateStg(this.socioModal.fec_can_date);
    }
    console.log('fin');
  }

  private formatDateStg(input: DatepickerModelVO): Date {
    return new Date(input.year + '/' + input.month + '/' + input.day);
  }

  public volverDetalle(): void {
    this.principalContainer = true;
  }

  private validateNew(): void {
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

    // Campo: Rut Socio
    // TODO: Pendinete generar validació del formatorut.
    if (typeof this.socioModal.rut_cop === 'undefined' || this.socioModal.rut_cop === null || this.socioModal.rut_cop === '') {
      //distinto de vacio o indefinido.
      this.hashMapError.set('val_rut_cop', 'Rut Cliente es Obligatorio');
    } else if (this.socioModal.rut_cop.length > 13) {
      this.hashMapError.set('val_rut_cop', 'Rut Cliente tiene un largo superior al permitido');
    }

    // Campo: Nombres
    if (typeof this.socioModal.nombres === 'undefined' || this.socioModal.nombres === null || this.socioModal.nombres === '') {
      //distinto de vacio o indefinido.
      this.hashMapError.set('val_nombres', 'Nombres es Obligatorio');
    } else if (this.socioModal.nombres.length > 70) {
      this.hashMapError.set('val_nombres', 'Nombres tienen un largo superior al permitido');
    }

    // Campo: Apellido Paterno
    if (typeof this.socioModal.ape_pat === 'undefined' || this.socioModal.ape_pat === null || this.socioModal.ape_pat === '') {
      //distinto de vacio o indefinido.
      this.hashMapError.set('val_ape_pat', 'Apellido Paterno es Obligatorio');
    } else if (this.socioModal.ape_pat.length > 50) {
      this.hashMapError.set('val_ape_pat', 'Apellido Paterno tiene un largo superior al permitido');
    }

    // Campo: Apellido Materno
    if (typeof this.socioModal.ape_mat === 'undefined' || this.socioModal.ape_mat === null || this.socioModal.ape_mat === '') {
      //distinto de vacio o indefinido.
      this.hashMapError.set('val_ape_mat', 'Apellido Materno es Obligatorio');
    } else if (this.socioModal.ape_mat.length > 50) {
      this.hashMapError.set('val_ape_mat', 'Apellido Materno tiene un largo superior al permitido');
    }

    // Campo: Código Luzagro
    if (typeof this.socioModal.cod_cop === 'undefined' || this.socioModal.cod_cop === null || this.socioModal.cod_cop < 0) {
      //distinto de vacio o indefinido.
      this.hashMapError.set('val_cod_cop', 'Código Luzagro es Obligatorio');
    } else if (this.socioModal.cod_cop > 100000000) {
      this.hashMapError.set('val_cod_cop', 'Código Luzagro tiene un largo superior al permitido');
    }

    // Campo: Código Luzlinares
    if (typeof this.socioModal.cod_lli === 'undefined' || this.socioModal.cod_lli === null || this.socioModal.cod_lli < 0) {
      //distinto de vacio o indefinido.
      this.hashMapError.set('val_cod_lli', 'Código Luzlinares es Obligatorio');
    } else if (this.socioModal.cod_lli > 100000000) {
      this.hashMapError.set('val_cod_lli', 'Código Luzlinares tiene un largo superior al permitido');
    }

    // Campo: Código Anterior
    if (typeof this.socioModal.cod_ant === 'undefined' || this.socioModal.cod_ant === null || this.socioModal.cod_ant < 0) {
      //distinto de vacio o indefinido.
      this.hashMapError.set('val_cod_ant', 'Código Anterior es Obligatorio');
    } else if (this.socioModal.cod_ant > 100000000) {
      this.hashMapError.set('val_cod_ant', 'Código Anterior tiene un largo superior al permitido');
    }

    // Campo: Código Nuevo
    if (typeof this.socioModal.cod_nvo === 'undefined' || this.socioModal.cod_nvo === null || this.socioModal.cod_nvo < 0) {
      //distinto de vacio o indefinido.
      this.hashMapError.set('val_cod_nvo', 'Código Nuevo es Obligatorio');
    } else if (this.socioModal.cod_nvo > 100000000) {
      this.hashMapError.set('val_cod_nvo', 'Código Nuevo tiene un largo superior al permitido');
    }

    // Campo: Código Original
    if (typeof this.socioModal.cod_ori === 'undefined' || this.socioModal.cod_ori === null || this.socioModal.cod_ori < 0) {
      //distinto de vacio o indefinido.
      this.hashMapError.set('val_cod_ori', 'Código Original es Obligatorio');
    } else if (this.socioModal.cod_ori > 100000000) {
      this.hashMapError.set('val_cod_ori', 'Código Original tiene un largo superior al permitido');
    }

    // Campo: Sector
    if (typeof this.socioModal.sec_cop_codigo === 'undefined' || (typeof this.socioModal.sec_cop_codigo === 'string' && this.socioModal.sec_cop_codigo === '')) {
      //distinto de vacio o indefinido.
      this.hashMapError.set('val_sec_cop_codigo', 'Sector es Obligatorio');
    }

    // Campo: Año Inscripción
    if (typeof this.socioModal.ano_inc === 'undefined' || this.socioModal.ano_inc === null || this.socioModal.ano_inc < 0) {
      //distinto de vacio o indefinido.
      this.hashMapError.set('val_ano_inc', 'Año Inscripción es Obligatorio');
    } else if (this.socioModal.ano_inc > 9990) {
      this.hashMapError.set('val_ano_inc', 'Año Inscripción tiene un largo superior al permitido');
    }

    // Campo: Monto Inscripción
    if (typeof this.socioModal.mto_inc === 'undefined' || this.socioModal.mto_inc === null || this.socioModal.mto_inc < 0) {
      this.hashMapError.set('val_mto_inc', 'Monto Inscripción es Obligatorio');
    } else if (this.socioModal.mto_inc > 100000000) {
      this.hashMapError.set('val_cod_ori', 'Monto Inscripción tiene un largo superior al permitido');
    }

    // Campo: Fecha Inscripción
    if (typeof this.socioModal.fec_inc_date == 'undefined' || this.socioModal.fec_inc_date == null) {
      if (!this.validateFormatDate(this.socioModal.fec_inc_date)) {
        this.hashMapError.set('val_fec_inc_date', 'Fecha Inscripción es Obligatorio');
      }
    } else if (!this.validateFormatDate(this.socioModal.fec_inc_date)) {
      this.hashMapError.set('val_fec_inc_date', 'Fecha Inscripción es Obligatorio');
    } else {
      // yyyy-mm-dd
      this.socioModal.fec_inc = new Date(this.socioModal.fec_inc_date.year + '-' + this.socioModal.fec_inc_date.month + '-' + this.socioModal.fec_inc_date.day);
    }

    // Campo: Año Traspaso
    if (typeof this.socioModal.ano_tra === 'undefined' || this.socioModal.ano_tra === null || this.socioModal.ano_tra < 0) {
      this.hashMapError.set('val_ano_tra', 'Año Traspaso es Obligatorio');
    } else if (this.socioModal.ano_tra > 9990) {
      this.hashMapError.set('val_ano_tra', 'Año Traspaso tiene un largo superior al permitido');
    }

    // Campo: Capital Traspaso
    if (typeof this.socioModal.kap_tra === 'undefined' || this.socioModal.kap_tra === null || this.socioModal.kap_tra < 0) {
      this.hashMapError.set('val_kap_tra', 'Capital Traspaso es Obligatorio');
    } else if (this.socioModal.kap_tra > 100000000) {
      this.hashMapError.set('val_ckap_tra', 'Capital Traspaso tiene un largo superior al permitido');
    }

    // Campo: Fecha Traspaso
    if (typeof this.socioModal.fec_tra_date == 'undefined' || this.socioModal.fec_tra_date == null) {
      if (!this.validateFormatDate(this.socioModal.fec_tra_date)) {
        this.hashMapError.set('val_fec_tra_date', 'Fecha Traspaso es Obligatorio');
      }
    } else if (!this.validateFormatDate(this.socioModal.fec_tra_date)) {
      this.hashMapError.set('val_fec_tra_date', 'Fecha Traspaso es Obligatorio');
    } else {
      // yyyy-mm-dd
      this.socioModal.fec_tra = new Date(this.socioModal.fec_tra_date.year + '-' + this.socioModal.fec_tra_date.month + '-' + this.socioModal.fec_tra_date.day);
    }

    // Campo: Acciones Traspaso
    if (typeof this.socioModal.acc_tra === 'undefined' || this.socioModal.acc_tra === null || this.socioModal.acc_tra < 0) {
      this.hashMapError.set('val_acc_tra', 'Acciones Traspaso es Obligatorio');
    } else if (this.socioModal.acc_tra > 100000000) {
      this.hashMapError.set('val_acc_tra', 'Acciones Traspaso tiene un largo superior al permitido');
    }

    // Campo: Acciones Retiro
    if (typeof this.socioModal.acc_ret === 'undefined' || this.socioModal.acc_ret === null || this.socioModal.acc_ret < 0) {
      this.hashMapError.set('val_acc_ret', 'Acciones Retiro es Obligatorio');
    } else if (this.socioModal.acc_ret > 100000000) {
      this.hashMapError.set('val_acc_ret', 'Acciones Retiro tiene un largo superior al permitido');
    }

    // Campo: Acciones Aporte
    if (typeof this.socioModal.acc_apo === 'undefined' || this.socioModal.acc_apo === null || this.socioModal.acc_apo < 0) {
      this.hashMapError.set('val_acc_apo', 'Acciones Aporte es Obligatorio');
    } else if (this.socioModal.acc_apo > 100000000) {
      this.hashMapError.set('val_acc_apo', 'Acciones Aporte tiene un largo superior al permitido');
    }

    // Campo: Actualización
    if (typeof this.socioModal.fec_act_date == 'undefined' || this.socioModal.fec_act_date == null) {
      if (!this.validateFormatDate(this.socioModal.fec_act_date)) {
        this.hashMapError.set('val_fec_act_date', 'Actualización es Obligatorio');
      }
    } else if (!this.validateFormatDate(this.socioModal.fec_act_date)) {
      this.hashMapError.set('val_fec_act_date', 'Actualización es Obligatorio');
    } else {
      // yyyy-mm-dd
      this.socioModal.fec_act = new Date(this.socioModal.fec_act_date.year + '-' + this.socioModal.fec_act_date.month + '-' + this.socioModal.fec_act_date.day);
    }

    // Campo: Estado Traspao
    if (typeof this.socioModal.est_tra === 'undefined' || this.socioModal.est_tra === null || this.socioModal.est_tra === '') {
      this.hashMapError.set('val_est_tra', 'Estado Traspao es Obligatorio');
    } else if (this.socioModal.est_tra.length > 70) {
      this.hashMapError.set('val_est_tra', 'Estado Traspao tiene un largo superior al permitido');
    }

    // Campo: Estado del Bono
    if (typeof this.socioModal.est_bon === 'undefined' || this.socioModal.est_bon === null || this.socioModal.est_bon < 0) {
      this.hashMapError.set('val_est_bon', 'Estado del Bono es Obligatorio');
    } else if (this.socioModal.est_bon > 100000000) {
      this.hashMapError.set('val_est_bon', 'Estado del Bono tiene un largo superior al permitido');
    }

    // Campo: Dirección Postal
    if (typeof this.socioModal.dir_pos === 'undefined' || this.socioModal.dir_pos === null || this.socioModal.dir_pos === '') {
      this.hashMapError.set('val_dir_pos', 'Dirección Postal es Obligatorio');
    } else if (this.socioModal.dir_pos.length > 70) {
      this.hashMapError.set('val_dir_pos', 'Dirección Postal tiene un largo superior al permitido');
    }

    // Campo: Nro Teléfono 1
    if (typeof this.socioModal.nro_te1 !== 'undefined' && this.socioModal.nro_te1 !== null) {
      if (this.socioModal.nro_te1 !== '') {
        if (9 < this.socioModal.nro_te1.length) {
          this.hashMapError.set('val_nro_te1', 'Nro Teléfono 1 no debe tener mas de 9 Caracteres');
        }
      }
    }

    // Campo: Nro Teléfono 2
    if (typeof this.socioModal.nro_te2 !== 'undefined' && this.socioModal.nro_te2 !== null) {
      if (this.socioModal.nro_te2 !== '') {
        if (9 < this.socioModal.nro_te2.length) {
          this.hashMapError.set('val_nro_te2', 'Nro Teléfono 2 no debe tener mas de 9 Caracteres');
        }
      }
    }

    // Campo: Nro Teléfono 3
    if (typeof this.socioModal.nro_te3 !== 'undefined' && this.socioModal.nro_te3 !== null) {
      if (this.socioModal.nro_te3 !== '') {
        if (9 < this.socioModal.nro_te3.length) {
          this.hashMapError.set('val_nro_te3', 'Nro Teléfono 3 no debe tener mas de 9 Caracteres');
        }
      }
    }

    // Campo: Nro Teléfono 4
    if (typeof this.socioModal.nro_te4 !== 'undefined' && this.socioModal.nro_te4 !== null) {
      if (this.socioModal.nro_te4 !== '') {
        if (9 < this.socioModal.nro_te4.length) {
          this.hashMapError.set('val_nro_te4', 'Nro Teléfono 4 no debe tener mas de 9 Caracteres');
        }
      }
    }

    // Campo: Comuna
    if (typeof this.socioModal.com_pos_codigo === 'undefined'
      || (typeof this.socioModal.com_pos_codigo === 'string' && this.socioModal.com_pos_codigo === '')) {
      this.hashMapError.set('val_com_pos_codigo', 'Comuna es Obligatorio');
    }

    // Campo: Observación
    if (typeof this.socioModal.obs_cap === 'undefined' || this.socioModal.obs_cap === null || this.socioModal.obs_cap === '') {
      this.hashMapError.set('val_obs_cap', 'Observación es Obligatorio');
    } else if (this.socioModal.obs_cap.length > 120) {
      this.hashMapError.set('val_obs_cap', 'Observación tiene un largo superior al permitido');
    }

    // ************************************************************************************************
    // ************************************************************************************************
    // ***************************  Campos ocultos en la tabla de socios  *****************************
    // ************************************************************************************************
    // ************************************************************************************************
    // .
    // Campo: nro_sol
    if (typeof this.socioModal.nro_sol === 'undefined' || this.socioModal.nro_sol === null || this.socioModal.nro_sol < 0) {
      // TODO: validar formato de ser requeido
      this.hashMapError.set('val_nro_sol', 'nro_sol es Obligatorio');
    } else if (this.socioModal.nro_sol > 100000000) {
      this.hashMapError.set('val_nro_sol', 'nro_sol tiene un largo superior al permitido');
    }

    // Campo: fec_sol
    if (typeof this.socioModal.fec_sol_date == 'undefined' || this.socioModal.fec_sol_date == null) {
      if (!this.validateFormatDate(this.socioModal.fec_sol_date)) {
        this.hashMapError.set('val_fec_sol_date', 'fec_sol es Obligatorio');
      }
    } else if (!this.validateFormatDate(this.socioModal.fec_sol_date)) {
      this.hashMapError.set('val_fec_sol_date', 'fec_sol es Obligatorio');
    } else {
      // yyyy-mm-dd
      this.socioModal.fec_sol = new Date(this.socioModal.fec_sol_date.year + '-' + this.socioModal.fec_sol_date.month + '-' + this.socioModal.fec_sol_date.day);
    }

    // Campo: fec_apr
    if (typeof this.socioModal.fec_apr_date == 'undefined' || this.socioModal.fec_apr_date == null) {
      if (!this.validateFormatDate(this.socioModal.fec_apr_date)) {
        this.hashMapError.set('val_fec_apr_date', 'fec_apr es Obligatorio');
      }
    } else if (!this.validateFormatDate(this.socioModal.fec_apr_date)) {
      this.hashMapError.set('val_fec_apr_date', 'fec_apr es Obligatorio');
    } else {
      // yyyy-mm-dd
      this.socioModal.fec_apr = new Date(this.socioModal.fec_apr_date.year + '-' + this.socioModal.fec_apr_date.month + '-' + this.socioModal.fec_apr_date.day);
    }

    // Campo: fec_can
    if (typeof this.socioModal.fec_can_date == 'undefined' || this.socioModal.fec_can_date == null) {
      if (!this.validateFormatDate(this.socioModal.fec_can_date)) {
        this.hashMapError.set('val_fec_can_date', 'fec_can es Obligatorio');
      }
    } else if (!this.validateFormatDate(this.socioModal.fec_can_date)) {
      this.hashMapError.set('val_fec_can_date', 'fec_can es Obligatorio');
    } else {
      // yyyy-mm-dd
      this.socioModal.fec_can = new Date(this.socioModal.fec_can_date.year + '-' + this.socioModal.fec_can_date.month + '-' + this.socioModal.fec_can_date.day);
    }

    // Campo: est_sol
    if (typeof this.socioModal.est_sol === 'undefined' || this.socioModal.est_sol === null || this.socioModal.est_sol === '') {
      this.hashMapError.set('val_est_sol', 'est_sol es Obligatorio');
    } else if (this.socioModal.est_sol.length > 13) {
      this.hashMapError.set('val_est_sol', 'est_sol tiene un largo superior al permitido');
    }

    // Campo: sec_cte
    if (typeof this.socioModal.sec_cte === 'undefined' || this.socioModal.sec_cte === null || this.socioModal.sec_cte < 0) {
      this.hashMapError.set('val_sec_cte', 'sec_cte es Obligatorio');
    } else if (this.socioModal.sec_cte > 100000000) {
      this.hashMapError.set('val_sec_cte', 'sec_cte tiene un largo superior al permitido');
    }

    // Campo: area
    if (typeof this.socioModal.area === 'undefined' || this.socioModal.area === null || this.socioModal.area < 0) {
      this.hashMapError.set('val_area', 'area es Obligatorio');
    } else if (this.socioModal.area > 100000000) {
      this.hashMapError.set('val_area', 'area tiene un largo superior al permitido');
    }

    // Campo: sec_imp
    if (typeof this.socioModal.sec_imp === 'undefined' || this.socioModal.sec_imp === null || this.socioModal.sec_imp < 0) {
      this.hashMapError.set('val_sec_imp', 'sec_imp es Obligatorio');
    } else if (this.socioModal.sec_imp > 100000000) {
      this.hashMapError.set('val_sec_imp', 'sec_imp tiene un largo superior al permitido');
    }

    // Campo: est_reg
    if (typeof this.socioModal.est_reg === 'undefined' || this.socioModal.est_reg === null || this.socioModal.est_reg === '') {
      this.hashMapError.set('val_est_reg', 'est_reg es Obligatorio');
    } else if (this.socioModal.est_reg.length > 13) {
      this.hashMapError.set('val_est_reg', 'est_reg tiene un largo superior al permitido');
    }

    // Campo: acc_con
    if (typeof this.socioModal.acc_con === 'undefined' || this.socioModal.acc_con === null || this.socioModal.acc_con < 0) {
      this.hashMapError.set('val_acc_con', 'acc_con es Obligatorio');
    } else if (this.socioModal.acc_con > 100000000) {
      this.hashMapError.set('val_acc_con', 'acc_con tiene un largo superior al permitido');
    }

    // Campo: aju_acc
    if (typeof this.socioModal.aju_acc === 'undefined' || this.socioModal.aju_acc === null || this.socioModal.aju_acc < 0) {
      this.hashMapError.set('val_aju_acc', 'aju_acc es Obligatorio');
    } else if (this.socioModal.aju_acc > 100000000) {
      this.hashMapError.set('val_aju_acc', 'aju_acc tiene un largo superior al permitido');
    }
    // ************************************************************************************************
    // ************************************************************************************************
    // ************************************************************************************************
    // ************************************************************************************************
  }

  private validateFormatDate(inputDate: DatepickerModelVO | undefined): boolean {
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

  public cleanFieldRutCop(): void {
    this.socioModal.rut_cop = this.socioModal.rut_cop.trim();
  }

  public cleanFieldNombres(): void {
    this.socioModal.nombres = this.socioModal.nombres!.trim();
  }

  public cleanFieldApePat(): void {
    this.socioModal.ape_pat = this.socioModal.ape_pat!.trim();
  }

  public cleanFieldApeMat(): void {
    this.socioModal.ape_mat = this.socioModal.ape_mat!.trim();
  }

}
