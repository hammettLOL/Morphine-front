// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  exp: number;
  // Otros campos que necesites...
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private readonly router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        // Si el token ha expirado, la propiedad exp es un timestamp en segundos
        if (decoded.exp * 1000 < Date.now()) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      } catch (error) {
        this.router.navigate(['/login']);
        return false;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}
