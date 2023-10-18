import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthenticationService} from '../Data/authentication-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate{

    constructor(
        private _router: Router,
        private _authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this._authenticationService.currentUserValue;
        if (currentUser) {
            // logged in so return true
           // this._authenticationService.logout();
            return true;
        }

        // not logged in so redirect to login page with the return url
        this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
