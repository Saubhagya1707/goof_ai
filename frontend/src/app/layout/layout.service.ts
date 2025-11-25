import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { RouteService } from './route.service';
import { SidebarItem } from './sidebar.component';
import { HttpClient } from '@angular/common/http';


export type LayoutTheme = 'light' | 'dark';
export type SidebarPosition = 'left' | 'right';
export type SidebarState = 'collapsed' | 'expanded';
export interface LayoutConfig {
  theme: LayoutTheme;
  hideAll?: boolean;
  sidebar: {
    collapsed: boolean;
    position: SidebarPosition;
    items: SidebarItem[]
  };
}

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  config: BehaviorSubject<LayoutConfig> = new BehaviorSubject<LayoutConfig>({
    theme: 'light',
    sidebar: {
      collapsed: false,
      position: 'left',
      items: []
    }
  });
  private _routeService: RouteService = inject(RouteService);
  $destroy = new Subject<any>();
  namespaceSubject = new BehaviorSubject<string>('');
  namespace$ = this.namespaceSubject.asObservable();
  // Observable to watch for changes in the layout configuration
  config$ = this.config.asObservable();
  breadcrumbItems$ = this._routeService.breadcrumbItems$;
  constructor() {
    this._routeService.routeData$.pipe(
      takeUntil(this.$destroy)
    ).subscribe({
      next: (data) => {
        console.log('in layout service: data', data)
        this.updateConfig(data)
      }
    });
  }

  // Method to update the layout configuration
  updateConfig(newConfig: Partial<LayoutConfig>) {
    this.config.next({ ...this.config.value, ...newConfig });
  }
  
  updateNamespace(namespace: string) {
    this.namespaceSubject.next(namespace);
  }

}
