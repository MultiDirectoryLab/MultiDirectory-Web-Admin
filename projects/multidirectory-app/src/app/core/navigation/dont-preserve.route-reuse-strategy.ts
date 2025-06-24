import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
export default class DontPreserveRouteReuseStrategy extends RouteReuseStrategy {
  override shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  override store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {}
  override shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  override retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }
  override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false;
  }
}
