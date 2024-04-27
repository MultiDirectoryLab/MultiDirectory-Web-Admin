import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { translate } from '@ngneat/transloco';
import { ModalInjectDirective } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { IpOption, IpRange } from '@core/access-policy/access-policy-ip-address';

export class IpAddressStatus {
  title: string = '';
  address: IpOption = '';
  valid: boolean = false;

  constructor(address: IpOption = '', valid: boolean = false) {
    this.address = address;
    this.title =
      typeof this.address == 'string' ? this.address : `${this.address.start}-${this.address.end}`;
    this.validate();
  }

  validate() {
    const validIp = new RegExp(/^(?:\d{1,3}\.?){4}$/);
    const validSubnet = new RegExp(/^(?:\d{1,3}\.?){4}(?:\/\d{1,3})?$/);
    this.valid = false;
    if (typeof this.address == 'string') {
      if (this.address.includes('-')) {
        const parts = this.address.split('-').map((x) => x.trim());
        this.address = new IpRange({
          start: parts[0],
          end: parts[1],
        });
        this.valid = [this.address.end, this.address.start].every(
          (x) => x.match(validIp) || x.match(validSubnet),
        );
        return this;
      }
      this.valid = !!this.address.match(validIp) || !!this.address.match(validSubnet);
    } else {
      this.valid = [this.address.end, this.address.start].every(
        (x) => x.match(validIp) || x.match(validSubnet),
      );
    }
    return this;
  }

  update(input: string) {
    this.title = input;
    if (input.includes('-')) {
      const parts = input.split('-').map((x) => x.trim());
      const validIp = new RegExp(/^(?:\d{1,3}\.?){4}$/);
      const validSubnet = new RegExp(/^(?:\d{1,3}\.?){4}(?:\/\d{1,3})?$/);
      if (parts.length == 2 && parts.every((x) => x.match(validIp) || x.match(validSubnet))) {
        this.address = new IpRange({ start: parts[0], end: parts[1] });
        this.validate();
        return this;
      }
    }
    this.address = input;
    this.validate();
    return this;
  }
}

@Component({
  selector: 'app-access-policy-ip-list',
  templateUrl: './access-policy-ip-list.component.html',
  styleUrls: ['./access-policy-ip-list.component.scss'],
})
export class AccessPolicyIpListComponent implements OnInit {
  @ViewChild('ipInput', { static: true }) private _ipInput!: ElementRef<HTMLInputElement>;
  _ipAddresses: IpAddressStatus[] = [new IpAddressStatus('123')];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    @Inject(ModalInjectDirective) private modalControl: ModalInjectDirective,
  ) {}
  ngOnInit(): void {
    if (this.modalControl.contentOptions) {
      this._ipAddresses = this.modalControl.contentOptions.ipAddresses.map((x: IpOption) =>
        new IpAddressStatus(x).validate(),
      );
    }
  }

  finish() {
    this.modalControl.close(this._ipAddresses.filter((x) => x.valid).map((x) => x.address));
  }

  close() {
    this.modalControl.close(null);
  }

  addEntry(input: string) {
    if (input.trim() == '') {
      return;
    }
    this._ipAddresses.push(new IpAddressStatus().update(input));
    if (!this._ipAddresses[this._ipAddresses.length - 1].valid) {
      this.toastr.error(translate('access-policy-ip-list.incorrect-ip-format'));
    }
    return;
  }

  onNewKeyDown(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.addEntry(this._ipInput.nativeElement.innerText);
      this._ipInput.nativeElement.innerText = '';
      this.cdr.detectChanges();
    }
    if (event.key == 'Backspace' && this._ipInput.nativeElement.innerText.length == 0) {
      event.preventDefault();
      event.stopPropagation();
      this._ipAddresses.pop();
      this.cdr.detectChanges();
    }
  }
  onNewBlur(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.addEntry(this._ipInput.nativeElement.innerText);
    this._ipInput.nativeElement.innerText = '';
    this.cdr.detectChanges();
  }

  onEditKeyDown(event: KeyboardEvent, element: HTMLDivElement, index: number) {
    if (event.key == 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this._ipAddresses[index].update(element.innerText);
      this._ipInput.nativeElement.focus();
      this.cdr.detectChanges();
    }
    if (event.key == 'Backspace' && element.innerText.length == 0) {
      event.preventDefault();
      event.stopPropagation();
      this._ipAddresses.splice(index, 1);
      this.cdr.detectChanges();
    }
  }
  onEditBlur(event: Event, index: number, element: HTMLDivElement) {
    event.preventDefault();
    event.stopPropagation();
    this._ipAddresses[index].update(element.innerText);
    this._ipInput.nativeElement.focus();
    this.cdr.detectChanges();
  }
}
