import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../core/services/auth.service";


export const jwtInterceptor: HttpInterceptorFn = (req, next)=>{
    const authService = inject(AuthService);
    const token = authService.getToken();
    if (token && authService.isTokenValid()) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      console.log(req.body);
    }
    return next(req).pipe(
        catchError(err => {
          // Si llega aquí y el token está vencido o inválido, AuthService.logout() ya se invocó.
          return throwError(() => err);
        })
      );

    
}
