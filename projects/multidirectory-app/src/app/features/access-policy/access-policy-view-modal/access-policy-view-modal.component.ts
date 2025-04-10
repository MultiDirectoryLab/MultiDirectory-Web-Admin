import { AfterViewInit, ChangeDetectorRef, Component, inject, viewChild } from '@angular/core';
import { AccessPolicy } from '@core/access-policy/access-policy';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, ModalInjectDirective } from 'multidirectory-ui-kit';
import { AccessPolicyViewComponent } from '../access-policy-view/access-policy-view.component';

@Component({
  selector: 'app-access-policy-view-modal',
  templateUrl: './access-policy-view-modal.component.html',
  styleUrls: ['./access-policy-view-modal.component.scss'],
  imports: [AccessPolicyViewComponent, TranslocoPipe, ButtonComponent],
})
export class AccessPolicyViewModalComponent implements AfterViewInit {
  private modalControl = inject<ModalInjectDirective>(ModalInjectDirective);
  private cdr = inject(ChangeDetectorRef);

  readonly view = viewChild.required<AccessPolicyViewComponent>('view');
  accessClient = new AccessPolicy();

  ngAfterViewInit(): void {
    if (this.modalControl.contentOptions.accessPolicy) {
      this.accessClient = this.modalControl.contentOptions.accessPolicy;
      this.cdr.detectChanges();
    }
  }

  close() {
    this.modalControl.close(null);
  }

  save() {
    this.view().flush();
    this.modalControl.close(this.accessClient);
  }
}
