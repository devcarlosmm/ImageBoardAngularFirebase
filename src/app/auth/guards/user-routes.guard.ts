import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserRoutesGuard implements CanActivate, CanLoad {
  constructor(private router:Router, private authService:AuthService){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.authService.getState().subscribe(logged => {
        if(!logged){
          return this.router.navigate(["auth/login"]).then(() => false);;
        }else{
          return true;
        }
      });
      return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.authService.getState().subscribe(logged => {
        if(!logged){
          return this.router.navigate(["auth/login"]).then(() => false);;
        }else{
          return true;
        }
      });
      return true;
  }
}
