import { AfterViewInit, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { AccessPolicy } from '@core/access-policy/access-policy';
import { ModalInjectDirective, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { AccessPolicyViewComponent } from '../access-policy-view/access-policy-view.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-access-policy-view-modal',
  templateUrl: './access-policy-view-modal.component.html',
  styleUrls: ['./access-policy-view-modal.component.scss'],
  standalone: true,
  imports: [AccessPolicyViewComponent, MultidirectoryUiKitModule, TranslocoPipe],
})
export class AccessPolicyViewModalComponent implements AfterViewInit {
  @ViewChild('view') view!: AccessPolicyViewComponent;
  accessClient = new AccessPolicy();

  constructor(
    @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective,
    private cdr: ChangeDetectorRef,
  ) {}

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
    this.view.flush();
    this.modalControl.close(this.accessClient);
  }
}
