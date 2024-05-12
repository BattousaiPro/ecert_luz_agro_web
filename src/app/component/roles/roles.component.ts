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
        //console.log(JSON.stringify(data));
          this.roles.push(...data);
        this.cargar = false;
      },
      (err: any) => {
        console.log('Error loadCargarRoles subscribe');
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
