import { NgModule } from '@angular/core';
import { MdPortalComponent } from './portal.component';
import { MdPortalDirective } from './portal.directive';

@NgModule({
  imports: [],
  declarations: [MdPortalComponent, MdPortalDirective],
  exports: [MdPortalComponent, MdPortalDirective],
})
export class MdPortalModule {}
