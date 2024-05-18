import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { InfoSocioComponent } from './component/page/info-socio/info-socio.component';
import { UsuariosComponent } from './component/usuarios/usuarios.component';
import { RolesComponent } from './component/roles/roles.component';
import { FichasSociosComponent } from './component/page/fichas-socios/fichas-socios.component';
import { HomeComponent } from './component/home/home.component';
import { PermisosComponent } from './component/permisos/permisos.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'infosocio', component: InfoSocioComponent },
    { path: 'roles', component: RolesComponent },
    { path: 'permisos', component: PermisosComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'fichas/socios', component: FichasSociosComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
