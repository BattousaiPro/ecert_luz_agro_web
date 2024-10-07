import { Component, OnInit } from '@angular/core';
import { DetailSocioComponent } from './detail-socio/detail-socio.component';
import { SpinnerComponent } from '../../utilitarios/spinner/spinner.component';
import { NgbModal, NgbPaginationModule, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KapmaeService, ReqImg } from '../../../services/kapmae/kapmae.service';
import { ModalOptions } from '../../../utils/modalOptions';
import { SectorService } from '../../../services/sector/sector.service';
import { ComunasService } from '../../../services/comunas/comunas.service';
import { Utility } from '../../../utils/utility';
import { ComunasVO, DataSocioVO, DatepickerModelVO, DocumentosImgVO, ImgListaVO, KapmaeRequestVO, SectorVO } from '../../../utils/modelsVos';

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
  socioSelectImgModal: DataSocioVO = new DataSocioVO();
  socioDeleteModal: DataSocioVO = new DataSocioVO();
  currentItem: DataSocioVO = new DataSocioVO();
  req: KapmaeRequestVO = new KapmaeRequestVO();

  cargar: boolean = false;
  isEdit: boolean = false;
  selectedAll: boolean = false;
  modals = new ModalOptions();
  collectionSize: number = 0;

  principalContainer: boolean = true;
  erroresList: string[] = [];
  isErroresList: boolean = false;

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
              let img: ImgListaVO = new ImgListaVO();
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

  public imprimirImg(rut_cop: string, cod_cop: number): void {
    let imgHabilitados: ReqImg = this.obtenerListaHabilitados();
    if (imgHabilitados.imgs.length > 0) {
      imgHabilitados.codCop = cod_cop;
      imgHabilitados.rutCop = rut_cop;
      this.impromirPdfImagens(imgHabilitados, cod_cop);
      //this.modals.info('Funcionalidad No disponible');
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

  private impromirPdfImagens(imgHabilitados: ReqImg, cod_cop: number): void {
    console.log('Method impromirPdfImagens');
    this.cargar = true;
    this.kapmaeService.impromirPdfImagens(imgHabilitados).subscribe(
      (data: any) => {
        if (data.code === '0') {
          let dat = new Date();
          let fileName = 'imagenes_' + cod_cop + '_';
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
        } else if (data.code === '-4') {
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
        if (data.code === '0') {
          this.closeModal();
          this.modals.success('Socio Modificado Con Éxito!');
          this.loadCargar();
        } else if (data.code === '-3') {
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
    this.erroresList = [];
    this.setIsErroresList(false);
    this.principalContainer = false;
  }

  public agregaModal(): void {
    console.log('Method agregaModal.');
    this.socioModal = new DataSocioVO();
    this.isEdit = false;
    this.erroresList = [];
    this.setIsErroresList(false);
    this.principalContainer = false;
  }

  private formatDateInput(inputDate: Date) {
    let fecIncDate: Date = new Date(inputDate);
    return { "year": fecIncDate.getFullYear(), "month": (fecIncDate.getMonth() + 1), "day": fecIncDate.getDate() };
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
    this.erroresList = [];
    this.isErroresList = false;
    this.erroresList = this.validateNew();
    if (this.erroresList.length > 0) {
      this.setIsErroresList(true);
    } else {
      this.setAttrApoyo();
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

  private setAttrApoyo(): void {
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

  private setIsErroresList(isErroresList: boolean): void {
    this.isErroresList = isErroresList;
  }

  public validateNew(): string[] {
    let errores: string[] = [];
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
    if (typeof this.socioModal.rut_cop === 'undefined' || this.socioModal.rut_cop === '') {
      //distinto de vacio o indefinido.
      errores.push('Rut Cliente es Obligatorio');
    }

    // Campo: Nombres
    if (typeof this.socioModal.nombres === 'undefined' || this.socioModal.nombres === '') {
      //distinto de vacio o indefinido.
      errores.push('Nombres es Obligatorio');
    }

    // Campo: Apellido Paterno
    if (typeof this.socioModal.ape_pat === 'undefined' || this.socioModal.ape_pat === '') {
      //distinto de vacio o indefinido.
      errores.push('Apellido Paterno es Obligatorio');
    }

    // Campo: Apellido Materno
    if (typeof this.socioModal.ape_mat === 'undefined' || this.socioModal.ape_mat === '') {
      //distinto de vacio o indefinido.
      errores.push('Apellido Materno es Obligatorio');
    }

    // Campo: Código Luzagro
    if (typeof this.socioModal.cod_cop === 'undefined' || this.socioModal.cod_cop < 0) {
      //distinto de vacio o indefinido.
      errores.push('Código Luzagro es Obligatorio');
    }

    // Campo: Código Luzlinares
    if (typeof this.socioModal.cod_lli === 'undefined' || this.socioModal.cod_lli < 0) {
      //distinto de vacio o indefinido.
      errores.push('Código Luzlinares es Obligatorio');
    }

    // Campo: Código Anterior
    if (typeof this.socioModal.cod_ant === 'undefined' || this.socioModal.cod_ant < 0) {
      //distinto de vacio o indefinido.
      errores.push('Código Anterior es Obligatorio');
    }

    // Campo: Código Nuevo
    if (typeof this.socioModal.cod_nvo === 'undefined' || this.socioModal.cod_nvo < 0) {
      //distinto de vacio o indefinido.
      errores.push('Código Nuevo es Obligatorio');
    }

    // Campo: Código Original
    if (typeof this.socioModal.cod_ori === 'undefined' || this.socioModal.cod_ori < 0) {
      //distinto de vacio o indefinido.
      errores.push('Código Original es Obligatorio');
    }

    // Campo: Sector
    if (typeof this.socioModal.sec_cop_codigo === 'undefined' || (typeof this.socioModal.sec_cop_codigo === 'string' && this.socioModal.sec_cop_codigo === '')) {
      //distinto de vacio o indefinido.
      errores.push('Sector es Obligatorio');
    }

    // Campo: Año Inscripción
    if (typeof this.socioModal.ano_inc === 'undefined' || this.socioModal.ano_inc < 0) {
      //distinto de vacio o indefinido.
      errores.push('Año Inscripción es Obligatorio');
    }

    // Campo: Monto Inscripción
    if (typeof this.socioModal.mto_inc === 'undefined' || this.socioModal.mto_inc < 0) {
      errores.push('Monto Inscripción es Obligatorio');
    }

    // Campo: Fecha Inscripción
    if (typeof this.socioModal.fec_inc_date != 'undefined') {
      if (!this.validateFormatDate(this.socioModal.fec_inc_date)) {
        errores.push('Fecha Inscripción es Obligatorio');
      }
    }

    // Campo: Año Traspaso
    if (typeof this.socioModal.ano_tra === 'undefined' || this.socioModal.ano_tra < 0) {
      errores.push('Año Traspaso es Obligatorio');
    }

    // Campo: Capital Traspaso
    if (typeof this.socioModal.kap_tra === 'undefined' || this.socioModal.kap_tra < 0) {
      errores.push('Capital Traspaso es Obligatorio');
    }

    // Campo: Fecha Traspaso
    if (typeof this.socioModal.fec_tra_date != 'undefined') {
      if (!this.validateFormatDate(this.socioModal.fec_tra_date)) {
        errores.push('Fecha Traspaso es Obligatorio');
      }
    }

    // Campo: Acciones Traspaso
    if (typeof this.socioModal.acc_tra === 'undefined' || this.socioModal.acc_tra < 0) {
      errores.push('Acciones Traspaso es Obligatorio');
    }

    // Campo: Acciones Retiro
    if (typeof this.socioModal.acc_ret === 'undefined' || this.socioModal.acc_ret < 0) {
      errores.push('Acciones Retiro es Obligatorio');
    }

    // Campo: Acciones Aporte
    if (typeof this.socioModal.acc_apo === 'undefined' || this.socioModal.acc_apo < 0) {
      errores.push('Acciones Aporte es Obligatorio');
    }

    // Campo: Actualización
    if (typeof this.socioModal.fec_act_date != 'undefined') {
      if (!this.validateFormatDate(this.socioModal.fec_act_date)) {
        errores.push('Actualización es Obligatorio');
      }
    }

    // Campo: Estado Traspao
    if (typeof this.socioModal.est_tra === 'undefined' || this.socioModal.est_tra === '') {
      errores.push('Estado Traspao es Obligatorio');
    }

    // Campo: Estado del Bono
    if (typeof this.socioModal.est_bon === 'undefined' || this.socioModal.est_bon < 0) {
      errores.push('Estado del Bono es Obligatorio');
    }

    // Campo: Dirección Postal
    if (typeof this.socioModal.dir_pos !== 'undefined' && this.socioModal.dir_pos !== null) {
      if (this.socioModal.dir_pos !== '') {
        if (9 < this.socioModal.dir_pos.length) {
          errores.push('Dirección Postal es Obligatorio');
        }
      }
    }

    // Campo: Nro Teléfono 1
    if (typeof this.socioModal.nro_te1 !== 'undefined' && this.socioModal.nro_te1 !== null) {
      if (this.socioModal.nro_te1 !== '') {
        if (9 < this.socioModal.nro_te1.length) {
          errores.push('Nro Teléfono 1 no debe tener mas de 9 Caracteres');
        }
      }
    }

    // Campo: Nro Teléfono 2
    if (typeof this.socioModal.nro_te2 !== 'undefined' && this.socioModal.nro_te2 !== null) {
      if (this.socioModal.nro_te2 !== '') {
        if (9 < this.socioModal.nro_te2.length) {
          errores.push('Nro Teléfono 2 no debe tener mas de 9 Caracteres');
        }
      }
    }

    // Campo: Nro Teléfono 3
    if (typeof this.socioModal.nro_te3 !== 'undefined' && this.socioModal.nro_te3 !== null) {
      if (this.socioModal.nro_te3 !== '') {
        if (9 < this.socioModal.nro_te3.length) {
          errores.push('Nro Teléfono 3 no debe tener mas de 9 Caracteres');
        }
      }
    }

    // Campo: Nro Teléfono 4
    if (typeof this.socioModal.nro_te4 !== 'undefined' && this.socioModal.nro_te4 !== null) {
      if (this.socioModal.nro_te4 !== '') {
        if (9 < this.socioModal.nro_te4.length) {
          errores.push('Nro Teléfono 4 no debe tener mas de 9 Caracteres');
        }
      }
    }

    // Campo: Comuna
    if (typeof this.socioModal.com_pos_codigo === 'undefined' || (typeof this.socioModal.com_pos_codigo === 'string' && this.socioModal.com_pos_codigo === '')) {
      errores.push('Comuna es Obligatorio');
    }

    // Campo: Observación
    if (typeof this.socioModal.obs_cap === 'undefined') {
      errores.push('Observación es Obligatorio');
    }

    // ************************************************************************************************
    // ************************************************************************************************
    // ***************************  Campos ocultos en la tabla de socios  *****************************
    // ************************************************************************************************
    // ************************************************************************************************
    // .
    // Campo: nro_sol
    //if (typeof this.socioModal.nro_sol === 'undefined' || this.socioModal.nro_sol < 0) {
    /*if (typeof this.socioModal.nro_sol !== 'undefined') {
      // TODO: validar formato de ser requeido
      // errores.push('Error con nro_sol');
    }*/

    // Campo: fec_sol
    if (typeof this.socioModal.fec_sol_date != 'undefined') {
      if (!this.validateFormatDate(this.socioModal.fec_sol_date)) {
        errores.push('fec_sol es Obligatorio');
      }
    }
    // Campo: fec_apr
    if (typeof this.socioModal.fec_apr_date != 'undefined') {
      if (!this.validateFormatDate(this.socioModal.fec_apr_date)) {
        errores.push('fec_apr es Obligatorio');
      }
    }
    // Campo: fec_can
    if (typeof this.socioModal.fec_can_date != 'undefined') {
      if (!this.validateFormatDate(this.socioModal.fec_can_date)) {
        errores.push('fec_can es Obligatorio');
      }
    }

    // Campo: est_sol 
    /*if (typeof this.socioModal.est_sol === 'undefined') {
      errores.push('Error con est_sol');
    }

    // Campo: sec_cte 
    if (typeof this.socioModal.sec_cte === 'undefined' || this.socioModal.sec_cte < 0) {
      errores.push('Error con sec_cte');
    }

    // Campo: area 
    if (typeof this.socioModal.area === 'undefined' || this.socioModal.area < 0) {
      errores.push('Error con area');
    }

    // Campo: sec_imp 
    if (typeof this.socioModal.sec_imp === 'undefined' || this.socioModal.sec_imp < 0) {
      errores.push('Error con sec_imp');
    }

    // Campo: est_reg 
    if (typeof this.socioModal.est_reg === 'undefined') {
      errores.push('Error con est_reg');
    }

    // Campo: acc_con 
    if (typeof this.socioModal.acc_con === 'undefined' || this.socioModal.acc_con < 0) {
      errores.push('Error con acc_con');
    }

    // Campo: aju_acc 
    if (typeof this.socioModal.aju_acc === 'undefined' || this.socioModal.aju_acc < 0) {
      errores.push('Error con aju_acc');
    }*/
    // ************************************************************************************************
    // ************************************************************************************************
    // ************************************************************************************************
    // ************************************************************************************************
    return errores;
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
