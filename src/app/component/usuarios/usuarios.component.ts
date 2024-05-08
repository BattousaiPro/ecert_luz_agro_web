import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {

  usuarios: Usuario[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadCargarRoles();
  }

  private loadCargarRoles(): void {
    this.usuarios.push({ id: 0, nombre: 'admin', ape_pat: 'admin - ape_pat', ape_mat: 'admin - ape_mat', email: 'admin@aaa.com', pass: 'qwerty1234',  estado: true });
    this.usuarios.push({ id: 1, nombre: 'svd', ape_pat: 'svd - ape_pat', ape_mat: 'svd - ape_mat', email: 'svd@aaa.com', pass: 'qwerty1234',  estado: true });
    this.usuarios.push({ id: 2, nombre: 'vmorales', ape_pat: 'vmorales - ape_pat', ape_mat: 'vmorales - ape_mat', email: 'vmorales@aaa.com', pass: 'qwerty1234',  estado: true });
    this.usuarios.push({ id: 3, nombre: 'jfuentes', ape_pat: 'jfuentes - ape_pat', ape_mat: 'jfuentes - ape_mat', email: 'jfuentes@aaa.com', pass: 'qwerty1234',  estado: true });
    this.usuarios.push({ id: 4, nombre: 'asaavedr', ape_pat: 'asaavedr - ape_pat', ape_mat: 'asaavedr - ape_mat', email: 'asaavedr@aaa.com', pass: 'qwerty1234',  estado: true });
    this.usuarios.push({ id: 5, nombre: 'mpesso', ape_pat: 'mpesso - ape_pat', ape_mat: 'mpesso - ape_mat', email: 'mpesso@aaa.com', pass: 'qwerty1234',  estado: true });
    this.usuarios.push({ id: 6, nombre: 'mvaldes', ape_pat: 'mvaldes - ape_pat', ape_mat: 'mvaldes - ape_mat', email: 'mvaldes@aaa.com', pass: 'qwerty1234',  estado: true });
    this.usuarios.push({ id: 7, nombre: 'xvega', ape_pat: 'xvega - ape_pat', ape_mat: 'xvega - ape_mat', email: 'xvega@aaa.com', pass: 'qwerty1234',  estado: true });
    this.usuarios.push({ id: 8, nombre: 'fruiz', ape_pat: 'fruiz - ape_pat', ape_mat: 'fruiz - ape_mat', email: 'fruiz@aaa.com', pass: 'qwerty1234',  estado: true });
    this.usuarios.push({ id: 9, nombre: 'chequera', ape_pat: 'chequera - ape_pat', ape_mat: 'chequera - ape_mat', email: 'chequera@aaa.com', pass: 'qwerty1234',  estado: true });
  }
}
export interface Usuario {
  id: number;
  nombre: string;
  ape_pat: string;
  ape_mat: string;
  email: string;
  pass: string;
  estado: boolean;
}