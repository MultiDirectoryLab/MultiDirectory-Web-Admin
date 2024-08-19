import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { translate } from '@jsverse/transloco';
import { ToastrService } from 'ngx-toastr';
import { AccessPolicy } from '@core/access-policy/access-policy';
import { Constants } from '@core/constants';

@Component({
  selector: 'app-acccess-policy',
  templateUrl: './access-policy.component.html',
  styleUrls: ['./access-policy.component.scss'],
})
export class AccessPolicyComponent implements AfterViewInit {
  @Input() index = 0;
  @Output() deleteClick = new EventEmitter<AccessPolicy>();
  @Output() turnOffClick = new EventEmitter<AccessPolicy>();
  @Output() editClick = new EventEmitter<AccessPolicy>();

  _accessClient: AccessPolicy | null = null;
  get accessClient(): AccessPolicy | null {
    return this._accessClient;
  }
  @Input() set accessClient(accessClient: AccessPolicy | null) {
    this._accessClient = accessClient;
    if (this._accessClient) {
      this.ipAddress = this._accessClient.ipRange
        .map((x) => (x instanceof Object ? x.start + '-' + x.end : x))
        .join(', ');
      this.groups = this._accessClient.groups
        .map((x) => {
          const name = new RegExp(Constants.RegexGetNameFromDn).exec(x);
          return name?.[1] ?? x;
        })
        .join(', ');
    }
  }

  ipAddress = '';

  groups = '';
  constructor(
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {}

  onDeleteClick() {
    if (!this.accessClient) {
      this.toastr.error(translate('access-policy.client-does-not-exist'));
      return;
    }
    this.deleteClick.emit(this.accessClient);
  }

  onTurnOffClick() {
    if (!this.accessClient) {
      this.toastr.error(translate('access-policy.client-does-not-exist'));
      return;
    }
    this.turnOffClick.emit(this.accessClient);
    this.cdr.detectChanges();
  }

  onEditClick() {
    if (!this.accessClient) {
      this.toastr.error(translate('access-policy.client-does-not-exist'));
      return;
    }
    this.editClick.emit(this.accessClient);
    this.cdr.detectChanges();
  }
}
