import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles/roles.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {

  roles: Role[] = [];
  cargar: boolean = false;

  constructor(private rolesService: RolesService) { }

  ngOnInit(): void {
    this.loadCargarRoles();
  }

  private loadCargarRoles(): void {
    console.log('Cargando loadCargarRoles');
    this.cargar = true;
    this.rolesService.obtenerRoles().subscribe(
      (data: any) => {
        // console.log(JSON.stringify(data));
        debugger
        if (data.code === '0') {
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

}
export interface Role {
  id: number;
  name: string;
  descrip: string;
  estado: boolean;
}
