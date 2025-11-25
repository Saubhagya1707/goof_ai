import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { BehaviorSubject } from 'rxjs';

@Component({
  standalone: true,
  selector: '[search-bar]',
  imports: [InputTextModule, FormsModule],
  template: `
    <div class="internal-page-utility-area py-1 w-full">
      <input [(ngModel)]="searchInput" (ngModelChange)="onSearchChange($event)" pInputText placeholder="Search" class="py-1 px-2" />
    </div>
  `
})
export class SearchBarComponent {
  searchInput: string = '';
  searchEvent: BehaviorSubject<string> = new BehaviorSubject<string>('');
  searchEvent$ = this.searchEvent.asObservable();

  onSearchChange(value: string): void {
    this.searchEvent.next(value);
  }
}
