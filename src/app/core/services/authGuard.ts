import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/service/auth-service';
import { map, take, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  //Allows to enter the application unless it is not connected
  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      if (user) {
        return true;
      } else {
        // redirect to home page
        router.navigate(['/']).then((r) => false);
        return false;
      }
    }),
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        console.log("Redirection vers la page d'accueil car l'utilisateur n'est pas authentifier");
      }
    }),
  );
};
