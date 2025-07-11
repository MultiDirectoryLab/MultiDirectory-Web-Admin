import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { IpOption, IpRange } from '@core/access-policy/access-policy-ip-address';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, ModalInjectDirective, TooltipComponent } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { DialogService } from '../../../services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { IplistDialogData } from '../../../interfaces/ip-list-dialog.interface';

export class IpAddressStatus {
  title = '';
  address: IpOption = '';
  valid = false;

  constructor(address: IpOption = '') {
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
  selector: 'app-ip-list-dialog-component',
  templateUrl: './ip-list-dialog.component.html',
  styleUrls: ['./ip-list-dialog.component.scss'],
  imports: [TranslocoPipe, TooltipComponent, NgClass, ButtonComponent, DialogComponent],
})
export class IpListDialogComponent implements OnInit {
  private dialogData: IplistDialogData = inject(DIALOG_DATA);
  private dialog = inject(DialogService);
  private dialogRef = inject(DialogRef);

  private cdr = inject(ChangeDetectorRef);
  private toastr = inject(ToastrService);
  private readonly _ipInput = viewChild.required<ElementRef<HTMLInputElement>>('ipInput');
  _ipAddresses: IpAddressStatus[] = [new IpAddressStatus('')];

  ngOnInit(): void {
    this._ipAddresses = this.dialogData.addresses.map((x) => new IpAddressStatus(x));
  }

  finish() {
    const addresses = this._ipAddresses.filter((x) => x.valid).map((x) => x.address);
    this.dialog.close(this.dialogRef, { addresses: addresses });
  }

  close() {
    this.dialog.close(this.dialogRef, null);
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
    const _ipInput = this._ipInput();
    if (event.key == 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      const _ipInput = this._ipInput();
      this.addEntry(_ipInput.nativeElement.innerText);
      _ipInput.nativeElement.innerText = '';
      this.cdr.detectChanges();
    }

    if (event.key == 'Backspace' && _ipInput.nativeElement.innerText.length == 0) {
      event.preventDefault();
      event.stopPropagation();
      this._ipAddresses.pop();
      this.cdr.detectChanges();
    }
  }

  onNewBlur(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const _ipInput = this._ipInput();
    this.addEntry(_ipInput.nativeElement.innerText);
    _ipInput.nativeElement.innerText = '';
    this.cdr.detectChanges();
  }

  onEditKeyDown(event: KeyboardEvent, element: HTMLDivElement, index: number) {
    if (event.key == 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this._ipAddresses[index].update(element.innerText);
      this._ipInput().nativeElement.focus();
    }

    if (event.key == 'Backspace' && element.innerText.length == 0) {
      event.preventDefault();
      event.stopPropagation();
      this._ipAddresses.splice(index, 1);
    }
    this.cdr.detectChanges();
  }

  onEditBlur(event: Event, index: number, element: HTMLDivElement) {
    event.preventDefault();
    event.stopPropagation();
    this._ipAddresses[index].update(element.innerText);
    this._ipInput().nativeElement.focus();
    this.cdr.detectChanges();
  }
}
