import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpConfigService {
  // Use localhost for local dev, backend for Docker network
  readonly apiBaseUrl = this.isDocker() ? 'http://backend:8000/goof-ai/v1' : 'http://localhost:8000/goof-ai/v1';

  private isDocker(): boolean {
    return window.location.hostname === 'frontend' || window.location.hostname.includes('docker');
  }

  getApiUrl(endpoint: string): string {
    return `${this.apiBaseUrl}${endpoint}`;
  }
}

