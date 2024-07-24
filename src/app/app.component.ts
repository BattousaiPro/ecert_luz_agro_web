import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './component/utilitarios/sidebar/sidebar.component';
import { Utility } from './utils/utility';
import { Router } from '@angular/router';
import { UserService } from './services/user/user.service';
import { ModalOptions } from './utils/modalOptions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, RouterModule],
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
    public userService: UserService) { }

  async setPermiso(): Promise<void> {
    this.isPermisoSidebar = this.utility.verificarToken();
    console.log('this.isPermisoSidebar: ' + this.isPermisoSidebar);
    await this.userService.isLogged.subscribe(
      (data: any) => {
        if (!data) {
          this.modals.warning('Se ha perdido la sesión');
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
    this.userService.logOut();
    this.isPermisoSidebar = false;
    this.router.navigate(['']);
  }

}
