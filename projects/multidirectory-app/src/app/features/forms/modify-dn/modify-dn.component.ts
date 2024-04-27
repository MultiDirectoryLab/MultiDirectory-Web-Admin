import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { ModifyDnRequest } from '@models/modify-dn/modify-dn';
import { ModalInjectDirective } from 'multidirectory-ui-kit';
import { GroupSelectorComponent } from '../group-selector/group-selector.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-modify-dn',
  templateUrl: './modify-dn.component.html',
  styleUrls: ['./modify-dn.component.scss'],
})
export class ModifyDnComponent implements AfterViewInit {
  formValid = false;
  request = new ModifyDnRequest();
  @ViewChild('groupSelector') groupSelector!: GroupSelectorComponent;

  constructor(@Inject(ModalInjectDirective) private modalControl: ModalInjectDirective) {}

  ngAfterViewInit(): void {
    this.request.entry = this.modalControl.contentOptions?.['toModifyDn'];
  }

  onClose() {
    this.modalControl.close(null);
  }

  onFinish(event: Event) {
    this.modalControl.close(null);
  }

  showEntrySelector(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.groupSelector
      .open()
      .pipe(take(1))
      .subscribe((x) => {
        this.request.new_superior = x?.[0]?.id ?? '';
      });
  }
}
