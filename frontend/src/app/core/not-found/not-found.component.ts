import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [ButtonModule, RippleModule, CardModule],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        animate('800ms ease-out', keyframes([
          style({ opacity: 0, transform: 'translateY(20px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
        ]))
      ])
    ])
    // Removed Angular-based infinite pulse animation due to timing limitations
  ],
  template: `
  <div class="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden p-4">
    <!-- Floating Shapes -->
    <div class="absolute top-10 left-5 w-32 h-32 bg-white/10 rounded-full animate-ping"></div>
    <div class="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full animate-spin-slow"></div>

    <p-card class="max-w-lg w-full bg-white/80 backdrop-blur-lg border-none shadow-2xl rounded-3xl" @fadeInUp>
      <div class="text-center py-10 px-6 relative">
        <!-- Pulsing Icon -->
        <div class="mx-auto mb-6 w-20 h-20 flex items-center justify-center bg-gradient-to-tr from-pink-500 to-yellow-400 rounded-full shadow-lg" @pulse>
          <i class="pi pi-exclamation-triangle text-5xl text-white"></i>
        </div>

        <!-- Error Code -->
        <h1 class="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">404</h1>

        <!-- Main Message -->
        <h2 class="text-3xl font-semibold text-gray-800 mb-3">Oops! We can’t find that page</h2>

        <!-- Description -->
        <p class="text-gray-700 mb-6">
          The page you’re looking for might have been removed, renamed, or is temporarily unavailable.
        </p>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-6">
          <button pButton
                  type="button"
                  icon="pi pi-home"
                  label="Go Home"
                  class="p-button-lg p-button-rounded p-button-info"
                  (click)="goHome()"
                  pRipple>
          </button>
          <!-- <button pButton
                  type="button"
                  icon="pi pi-envelope"
                  label="Contact Us"
                  class="p-button-lg p-button-rounded p-button-help"
                  (click)="contactSupport()"
                  pRipple>
          </button> -->
        </div>
      </div>
    </p-card>
  </div>
  `,
  styleUrls: ['./not-found.component.sass']
})
export class NotFoundComponent {
  private router: Router = inject(Router);

  goHome() {
    this.router.navigateByUrl('/');
  }

  contactSupport() {
    window.location.href = '/support';
  }
}
