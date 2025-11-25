import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginPayload, SignUpPayload } from './models';
import { environment } from '../../../environment/environment';
import { Token } from './models';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  private _httpClient: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private readonly TOKEN_KEY = "access_token";

  login(request: LoginPayload): Observable<Token> {
    const formData = new FormData()
    formData.append("username", request.username)
    formData.append("password", request.password)
    return this._httpClient.post<Token>(`${environment.apiUrl}/admin/token`, formData).pipe(
      tap((token) => {
        this.setToken(token.access_token)
      })
    );
  }

  signUp(payload: SignUpPayload) : Observable<Token> {
    return this._httpClient.post<Token>(`${environment.apiUrl}/auth/users/signup`, payload).pipe(
      tap((token) => this.setToken(token.access_token))
    )
  }

  logout(): void {
    this.removeToken();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

}
