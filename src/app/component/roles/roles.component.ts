import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles/roles.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [SpinnerComponent, FormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {

  roles: Role[] = [];
  cargar: boolean = false;

  constructor(private modalService: NgbModal,
    private rolesService: RolesService) { }

  ngOnInit(): void {
    this.loadCargarRoles();
  }

  private loadCargarRoles(): void {
    console.log('Cargando loadCargarRoles');
    this.cargar = true;
    this.rolesService.obtenerRoles().subscribe(
      (data: any) => {
        // console.log(JSON.stringify(data));
        if (data.code === '0' && data.data != null) {
          this.roles.push(...data.data);
          // console.log(JSON.stringify(this.roles));
        } else {
          //this.error.mostrarError('Error con la respuesta de servicios de Roles');
          console.log('Error con la respuesta de servicios de Roles');
          alert('Error con la respuesta de servicios de Roles');
        }
        this.cargar = false;
      },
      (err: any) => {
        //this.error.mostrarError('Error con el ervicio de Roles');
        console.log('Error con el ervicio de Roles');
        alert('Error con el ervicio de Roles');
        this.cargar = false;
      });
  }

  public agregarRol(content: any): void {
    console.log('Method agregarRol.');
    this.openModalFunction(content);
  }

  openModalFunction(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' });
  }

}

export interface Role {
  id: number;
  name: string;
  descrip: string;
  estado: boolean;
}
