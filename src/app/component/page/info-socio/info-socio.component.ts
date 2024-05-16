import { Component } from '@angular/core';
import { DataSocio, listaSocios } from './model/dataMock';
import { DetailSocioComponent } from '../detail-socio/detail-socio.component';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KapmaeService } from '../../../services/kapmae/kapmae.service';

@Component({
  selector: 'app-info-socio',
  standalone: true,
  imports: [FormsModule, DetailSocioComponent, SpinnerComponent, CommonModule, NgbPaginationModule],
  templateUrl: './info-socio.component.html',
  styleUrl: './info-socio.component.scss'
})
export class InfoSocioComponent {

  socios: DataSocio[] = [];

  socioModal!: DataSocio;
  cargar: boolean = false;

  collectionSize: number = this.socios.length;
  page = 1;
  pageSize = 5;

  constructor(private modalService: NgbModal,
    private kapmaeService: KapmaeService
  ) {
    this.loadCargarKapMae();
  }

  private loadCargarKapMae(): void {
    console.log('Cargando loadCargarUsers');
    this.cargar = true;
    this.kapmaeService.obtenerKapMae().subscribe(
      (data: any) => {
        // console.log(JSON.stringify(data));
        if (data.code === '0' && data.data != null) {
          this.socios.push(...data.data);
          //this.socios.push(...listaSocios);
          this.refreshCountries('Init');
          // console.log(JSON.stringify(this.usuarios));
        } else {
          //this.error.mostrarError('Error con la respuesta de servicios de Socios');
          console.log('Error con la respuesta de servicios de Socios');
          alert('Error con la respuesta de servicios de Socios');
        }
        this.cargar = false;
      },
      (err: any) => {
        //this.error.mostrarError('Error con el ervicio de Socios');
        console.log('Error con el ervicio de Socios');
        alert('Error con el ervicio de Socios');
        this.cargar = false;
      });
  }

  refreshCountries(texto: string) {
    console.log(texto);
    this.setDefaultSociosData(this.socios);
  }

  private setDefaultSociosData(socios: DataSocio[]) {
    for (let index = 0; index < socios.length; index++) {
      socios[index].selected = false;
      socios[index].visibility = false;
    }
  }

  statusChange(socio: DataSocio, id: string = '') {
    console.log('Method cambioEstado.');
    if (id === '') {
      socio.selected = !socio.selected;
      for (let index = 0; index < this.socios.length; index++) {
        if (this.socios[index].id !== socio.id) {
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
      alert('debes seleccionar un Socio.');
    } else {
      alert('Funcionalidad No disponible.');
    }
  }

  cerfificado() {
    if (!this.validaSelected()) {
      alert('debes seleccionar un Socio para cerfificado.');
    } else {
      alert('Funcionalidad No disponible.');
    }
  }

  openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

  closeModalFunction() {
    this.modalService.dismissAll();
  }

  /********************************************************/
  // Sector de filtros
  public buscarByNombre(): void {
    console.log('Method buscarByNombre');
  }

  public buscarByApePaterno(): void {
    console.log('Method buscarByApePaterno');
  }

  public buscarByApeMaterno(): void {
    console.log('Method buscarByApeMaterno');
  }

  public buscarByRut(): void {
    console.log('Method buscarByRut');
  }

  public buscarByCodigo(): void {
    console.log('Method buscarByCodigo');
  }

  public buscarBySector(): void {
    console.log('Method buscarBySector');
  }
  /********************************************************/

}
