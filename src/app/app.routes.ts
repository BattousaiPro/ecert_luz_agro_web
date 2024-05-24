import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { KapmaeComponent } from './component/page/kapmae/kapmae.component';
import { UsuariosComponent } from './component/usuarios/usuarios.component';
import { RolesComponent } from './component/roles/roles.component';
import { FichasSociosComponent } from './component/page/fichas-socios/fichas-socios.component';
import { HomeComponent } from './component/home/home.component';
import { PermisosComponent } from './component/permisos/permisos.component';
import { SectoresComponent } from './component/page/sectores/sectores.component';
import { ComunasComponent } from './component/page/comunas/comunas.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'kapmae', component: KapmaeComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'roles', component: RolesComponent },
    { path: 'permisos', component: PermisosComponent },
    //{ path: 'sectores', component: SectoresComponent },
    //{ path: 'comunas', component: ComunasComponent },
    { path: 'fichas/socios', component: FichasSociosComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
