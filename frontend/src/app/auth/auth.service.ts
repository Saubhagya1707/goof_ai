import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpConfigService } from '../config/http-config.service';

// Define interfaces for API responses
interface LoginResponse {
  access_token: string;
}

interface CurrentUserResponse {
  email: string;
  id: number;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private config = inject(HttpConfigService);

  // POST form-urlencoded to the OAuth2 token endpoint used by FastAPI's
  // OAuth2PasswordRequestForm (expects application/x-www-form-urlencoded).
  login(username: string, password: string): Observable<LoginResponse> {
    const url = this.config.getApiUrl('/admin/token');
    // Use URLSearchParams to create application/x-www-form-urlencoded body
    const params = new URLSearchParams();
    params.set('username', username);
    params.set('password', password);
    params.set('grant_type', 'password');

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http
      .post<LoginResponse>(url, params.toString(), { headers })
      .pipe(tap((res) => localStorage.setItem('access_token', res.access_token)));
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  getCurrentUser(): Observable<CurrentUserResponse> {
    const url = this.config.getApiUrl('/admin/me');
    return this.http.get<CurrentUserResponse>(url);
  }
}
