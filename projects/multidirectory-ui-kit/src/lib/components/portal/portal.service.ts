import { ElementRef, Injectable, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MdPortalService {
  private portals = new Map<string, ViewContainerRef[]>();

  push(key: string, portal: ViewContainerRef) {
    if (this.portals.has(key) && this.portals.get(key)!.length > 0) {
      this.portals.get(key)!.push(portal);
    } else {
      this.portals.set(key, [portal]);
    }
  }

  pop(key: string, toDelete?: ViewContainerRef) {
    if (this.portals.has(key)) {
      if (toDelete) {
        const remained = this.portals.get(key)?.filter((x) => x !== toDelete);
        this.portals.set(key, remained ?? []);
      } else {
        this.portals.set(key, []);
      }
    }
  }

  get(key: string, index = -1): ViewContainerRef | undefined {
    if (this.portals.has(key)) {
      const stack = this.portals.get(key);
      if (!stack || stack?.length == 0) {
        return undefined;
      }
      if (index < 0 || index > stack.length) {
        return stack[stack.length - 1];
      }
      return stack[index];
    }
    return undefined;
  }
}
