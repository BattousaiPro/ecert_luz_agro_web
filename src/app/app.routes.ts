import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { InfoSocioComponent } from './component/page/info-socio/info-socio.component';
import { PermisosComponent } from './component/permisos/permisos.component';
import { RolesComponent } from './component/roles/roles.component';
import { FichasSociosComponent } from './component/page/fichas-socios/fichas-socios.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'infosocio', component: InfoSocioComponent },
    { path: 'roles', component: RolesComponent },
    { path: 'permisos', component: PermisosComponent },
    { path: 'fichas/socios', component: FichasSociosComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
