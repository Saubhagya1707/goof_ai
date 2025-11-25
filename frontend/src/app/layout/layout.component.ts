import { Component, inject } from '@angular/core';
import { LayoutConfig, LayoutService } from './layout.service';
import { SidebarComponent, SidebarItem } from "./sidebar.component";
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from "./breadcrumb.component";
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./footer/footer.component";
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [SidebarComponent, RouterModule, BreadcrumbComponent, CommonModule, FooterComponent, RippleModule, SelectModule, TooltipModule, FormsModule],
  template: `
    <div class="w-full h-screen flex flex-column relative  overflow-hidden">
      <header class="border-bottom-1 h-3rem flex align-items-center gap-2 px-2">
        <div pRipple class="cursor-pointer p-2" (click)="toggleSidebar($event)">
          <i class="fa-solid fa-bars" style="color: var(--p-primary-400);"></i>
        </div>
        <h2 class="text-secondary">KubeAnywhere</h2>
        <div class="ml-auto inline-flex align-items-center gap-2">
        <!-- <p-select pTooltip="Default Namespace" (ngModelChange)="updateDefaultNamespace($event)" [(ngModel)]="selectedNamespace" class="text-sm w-8rem h-1.5rem bg-white" [options]="namespaces" [optionLabel]="'name'" [placeholder]="getDefaultNamespace()"></p-select> -->
        </div>
      </header>
      <breadcrumb [items]="(layoutService.breadcrumbItems$ | async) ?? []"></breadcrumb>
      <div class="flex flex-1 overflow-hidden">
        <sidebar [isClosed]="config.sidebar.collapsed" [sidebarItems]="sidebarItems"></sidebar>
        <main class="main flex-1  border-primary overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
      <footer class="footer h-3rem border-1">
        <app-footer/>
      </footer>
    </div>
  `
})
export class LayoutComponent {


  layoutService: LayoutService = inject(LayoutService);
  sidebarItems: SidebarItem[] = [];
  destroy$ = new Subject();
  config!: LayoutConfig;

  ngOnInit() {
    this.layoutService.config$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.sidebarItems = data.sidebar.items;
        this.config = data;
      } 
    });   
  }

  
  toggleSidebar($event: MouseEvent) {
    this.config.sidebar.collapsed = !this.config.sidebar.collapsed;
    this.layoutService.updateConfig(this.config);
  }


}
