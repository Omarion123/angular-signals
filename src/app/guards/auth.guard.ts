import { inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessagesService } from '../messages/messages.service';

export const isUserAuthenticated: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessagesService);
  if (authService.isLoggedIn()) {
    return true;
  } else {
    messageService.showMessage('Not authenticated, login first', 'warning');
    return router.parseUrl('/login');
  }
};
