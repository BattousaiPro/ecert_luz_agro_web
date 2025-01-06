import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Utility } from './utils/utility';
import { Router } from '@angular/router';
import { ModalOptions } from './utils/modalOptions';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'ecert_web';
  sidebarExpanded = false;
  public utility = new Utility;
  isPermisoSidebar: boolean = false;
  modals = new ModalOptions();

  constructor(private router: Router,
    public authService: AuthService) { }

  async setPermiso(): Promise<void> {
    this.isPermisoSidebar = this.utility.verificarToken();
    //  console.log('this.isPermisoSidebar: ' + this.isPermisoSidebar);
    await this.authService.isLogged.subscribe(
      (data: any) => {
        if (!data) {
          //this.modals.warning('Se ha perdido la sesión');
          this.router.navigate(['']);
        }
      },
      (_err: any) => {
        this.modals.error('Error con el servicio');
      });
  }

  ngOnInit(): void {
    this.setPermiso();
  }

  logput() {
    localStorage.removeItem('datatoken');
    this.authService.logOut();
    this.isPermisoSidebar = false;
    this.router.navigate(['']);
  }

}
