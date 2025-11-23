import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainPanelComponent } from './components/main-panel/main-panel.component';
import { AuthService } from './auth/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, NavbarComponent, SidebarComponent, MainPanelComponent, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('frontend');
  private auth = inject(AuthService);
  private router = inject(Router);
  
  isLoginPage$ = this.router.events.pipe(
    map((event) => {
      if (event instanceof NavigationEnd) {
        return event.urlAfterRedirects === '/login';
      }
      return false;
    })
  );

  get isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }
}
