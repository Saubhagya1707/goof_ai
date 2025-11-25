import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { RouteService } from './route.service';
import { filter, Subject, take, takeUntil } from 'rxjs';

export interface SidebarItem {
  label: string
  iconClass?: string
  path: string
  relativeToChild?: boolean
}

@Component({
  standalone: true,
  selector: 'sidebar',
  imports: [RouterModule, CommonModule],
  template: `
    <aside class="sidebar" [class.closed]="isClosed">
      <ul>
        @for(item of sidebarItems; track item) {
          <li [ngClass]="{'active': activePath === item.path}" class="sidebar-item">
            <i [class]="item.iconClass"></i>
            <a [routerLink]="item.path">{{ item.label }}</a>
          </li>
        }
      </ul>
    </aside>
  `,
  styles: [
    `
    .sidebar{
      width: 250px;
      height: 100vh;
      left: 0;
      top: 0;
      position: relative;
      transition: all 0.3s ease;
      transform: translateX(0);
      padding: 0.5rem 0;
      border-right: 1px solid #ddd;
    }
    .sidebar-header {
      padding: 0 1.5rem 1.5rem;
      border-bottom: 1px solid #ddd;
      margin-bottom: 1rem;
    }

    .sidebar-item {
      padding: 0.75rem 1.5rem;
      margin: 0.25rem 0;
      border-radius: 6px;
      transition: all 0.2s ease;
      position: relative;
      text-align: center !important;

      a {
        color: #333;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.95rem;
      }

      &:hover {
        background: var(--p-primary-50);
      }

      &.active {
        background: rgba(var(--p-secondary-500), 0.1);
      }

      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 3px;
        background: var(--p-primary-400);
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      &.active:before {
        opacity: 1;
      }
    }

    a {
      font-weight: 400;
    }

    .sidebar.closed {
      transform: translateX(-100%);
      overflow: hidden;
      padding: 0;
      width: 0;
    }

    `
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input() sidebarItems: SidebarItem[] = [];
  @Input() isClosed: boolean = false;
  activePath!: string;
  destroy$ = new Subject<void>();

  protected activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit() {
    this.activePath = this.getActivePath();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => { 
        this.activePath = this.getActivePath();
        console.log(this.activePath);
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getActivePath() {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.routeConfig?.path || '';
  }
}
