import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {

  roles: Role[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadCargarRoles();
  }

  loadCargarRoles() {
    this.roles.push({ id: 0, nombre: 'Administrador' });
    this.roles.push({ id: 1, nombre: 'Ejecutivo' });
    this.roles.push({ id: 2, nombre: 'Cliente' });
    this.roles.push({ id: 3, nombre: 'Visitante' });
  }
}
export interface Role {
  id: number;
  nombre: string;
}