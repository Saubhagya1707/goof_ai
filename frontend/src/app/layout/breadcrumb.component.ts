import { Component, Input, SimpleChanges } from '@angular/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { SidebarItem } from './sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'breadcrumb',
  imports: [Breadcrumb, RouterModule],
  template: `
    <div class="h-2rem border-bottom-1 flex align-items-center px-2">
      <p-breadcrumb [model]="items" [home]="home">
        <ng-template #item let-item>
          <a class="cursor-pointer" [routerLink]="item.path">
              <span>{{item.label}}</span>
          </a>
        </ng-template>
        <ng-template #separator> / </ng-template>
      </p-breadcrumb>
    </div>
  `
})
export class BreadcrumbComponent {
  @Input() items: SidebarItem[] = []
  home: SidebarItem = { label: 'Home', path: ''}
  ngOnChanges(changes: SimpleChanges) {
    console.log('Breadcrumb items changed:', changes);
    ;
  }
}
