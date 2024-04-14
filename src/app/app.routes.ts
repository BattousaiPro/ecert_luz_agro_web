import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { InfoSocioComponent } from './component/page/info-socio/info-socio.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'infosocio', component: InfoSocioComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
