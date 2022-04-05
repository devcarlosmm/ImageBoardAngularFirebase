import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesRoutesGuard implements CanActivate {
  availableRoutes:string[] = ["j-m", "j-a", "t-g", "v-n"];

  constructor(private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return (this.availableRoutes.includes(route.params['id'])) ? true : this.router.navigateByUrl("404");
  }
}
