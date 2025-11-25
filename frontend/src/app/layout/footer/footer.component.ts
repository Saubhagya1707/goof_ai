import { ChangeDetectorRef, Component, inject, QueryList, ViewChildren } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

// footer.component.ts
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RippleModule, TooltipModule], // Import the TerminalComponent
  template: `
    <!-- @for(session of activeSessions; track session.id) {
      <app-terminal 
        (close)="onClose($event)" 
        (minimized)="onMinimize($event)" 
        [session]="session">
      </app-terminal>
    }
    <div class="overflow-x-hidden">
    <div  class="overflow-x-auto  flex-nowrap flex">
      <div class="flex flex-row gap-2 h-full w-full border-1">
        @for (item of minimizedSessions; track $index; let i=$index) {
          <div 
            class="flex flex-row gap-2 px-2 border-1 align-items-center flex-shrink-0" 
            [pTooltip]="item.name">
            <div 
              pRipple 
              class="flex align-items-center cursor-pointer" 
              (click)="openSession(item)">
              <span class="">{{item.name.slice(0,15)}}...</span>
            </div> 
            <div class="flex align-items-center">
              <i 
                pRipple 
                class="fa-solid fa-xmark cursor-pointer" 
                style="color: red;" 
                (click)="closeTerminal($event, item)">
              </i>
            </div>
          </div>
        }
    </div>
    </div>
    </div>
    <div class="flex flex-row absolute bottom-0 ml-2">
      <small style="font-size: 11px;" class="text-gray-500">Total Sessions: {{activeSessions.length}}</small>
    </div> -->
  `,
})
export class FooterComponent {
  destroy$ = new Subject<void>();
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit() {

  }

  
}