import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../app/core/services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[];
  const userRole = authService.getUserRole();

  if (userRole && allowedRoles?.includes(userRole)) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
