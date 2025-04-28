import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  token: string;
  name: string;
  lastName: string;
  email: string;
}

interface JwtPayload {
  exp: number;
  // otros campos que puedas necesitar
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.baseUrl;
  private readonly apiUrl = `${this.baseUrl}/api/auth`; 
  private readonly tokenKey = 'token';
  private readonly userNameKey = 'userName';
  private readonly userLastNameKey = 'userLastName';
  private readonly userEmailKey = 'userEmail';

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => this.setSession(response))
    );
  }

  private setSession(response: LoginResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userNameKey, response.name);
    localStorage.setItem(this.userLastNameKey, response.lastName);
    localStorage.setItem(this.userEmailKey, response.email);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      // La propiedad 'exp' es un timestamp en segundos
      if (decoded.exp * 1000 < Date.now()) {
        this.logout(); // El token expiró, cerramos sesión
        return false;
      }
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userNameKey);
    localStorage.removeItem(this.userLastNameKey);
    localStorage.removeItem(this.userEmailKey);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return this.isTokenValid();
  }
}
