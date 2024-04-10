import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent }
];
