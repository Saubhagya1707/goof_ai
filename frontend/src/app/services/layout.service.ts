import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LayoutState {
  sidebarOpen: boolean;
  sidebarWidth: number; // pixels
}

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private _state = new BehaviorSubject<LayoutState>({ sidebarOpen: true, sidebarWidth: 250 });
  readonly state$ = this._state.asObservable();

  toggleSidebar() {
    const s = this._state.value;
    this._state.next({ ...s, sidebarOpen: !s.sidebarOpen });
  }

  openSidebar() {
    const s = this._state.value;
    this._state.next({ ...s, sidebarOpen: true });
  }

  closeSidebar() {
    const s = this._state.value;
    this._state.next({ ...s, sidebarOpen: false });
  }

  setSidebarWidth(width: number) {
    const s = this._state.value;
    const w = Math.max(120, Math.min(600, Math.round(width)));
    this._state.next({ ...s, sidebarWidth: w });
  }
}
