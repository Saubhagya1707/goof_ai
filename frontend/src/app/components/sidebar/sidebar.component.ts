import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService, LayoutState } from '../../services/layout.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule]
})
export class SidebarComponent {
  state$ !: Observable<LayoutState>; 
  items = ['Home', 'Agents', 'OAuth', 'Settings'];

  constructor(private layout: LayoutService) {
    this.state$ = this.layout.state$;
  }

  toggle() {
    this.layout.toggleSidebar();
  }

  setWidth(v: number | string) {
    const num = typeof v === 'string' ? parseInt(v, 10) : v;
    if (!isNaN(num)) this.layout.setSidebarWidth(num);
  }
}
