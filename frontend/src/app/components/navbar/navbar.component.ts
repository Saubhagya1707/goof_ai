import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService, LayoutState } from '../../services/layout.service';
import { Observable } from 'rxjs';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, MenuModule, AvatarModule]
})
export class NavbarComponent {
  state$!: Observable<LayoutState>;
  private layout = inject(LayoutService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  avatarUrl: string | null = null;
  initials: string | null = null;

  menuModel = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  constructor() {
    this.state$ = this.layout.state$;
    this.loadUser();
  }

  toggle() {
    this.layout.toggleSidebar();
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  private loadUser() {
    this.auth.getCurrentUser().subscribe({
      next: (u) => {
        if (u && (u as any).name) {
          this.initials = this.toInitials((u as any).name || (u as any).email);
        } else if (u && (u as any).email) {
          this.initials = this.toInitials((u as any).email);
        }
        // Trigger change detection to update the view
        this.cdr.markForCheck();
      },
      error: () => {
        // ignore errors (not authenticated)
      }
    });
  }

  private toInitials(nameOrEmail: string): string {
    if (!nameOrEmail) return '';
    // If it's an email, take part before @; otherwise take first two words
    const local = nameOrEmail.split('@')[0];
    const parts = local.split(/\W+/).filter(Boolean);
    if (parts.length === 0) return local.slice(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
}
