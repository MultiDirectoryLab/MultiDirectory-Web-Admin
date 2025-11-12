import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { TranslocoPipe } from '@jsverse/transloco';
import { take } from 'rxjs';
import { ContextMenuService } from '../../../services/context-menu.service';

@Component({
  selector: 'app-rented-ip-context-menu',
  standalone: true,
  imports: [MultidirectoryUiKitModule, TranslocoPipe],
  templateUrl: './rented-ip-context-menu.component.html',
  styleUrl: './rented-ip-context-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RentedIpContextMenuComponent implements OnInit {
  @ViewChild('dropdown', { static: true }) dropdown!: ElementRef<HTMLDivElement>;

  private ngZone: NgZone = inject(NgZone);
  private contextMenuService: ContextMenuService = inject(ContextMenuService);

  ngOnInit(): void {
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.handleOverflow();
    });
  }

  protected reserveIp() {
    this.contextMenuService.close(true);
  }

  private handleOverflow(): void {
    const dropdownEl = this.dropdown.nativeElement;
    const dropdownRect: DOMRect = dropdownEl.getBoundingClientRect();

    const offsetX = window.innerWidth - (dropdownRect.x + dropdownRect.width);
    const offsetY = window.innerHeight - (dropdownRect.y + dropdownRect.height);

    dropdownEl.style.transform = `translate(${offsetX < 0 ? offsetX : 0}px, ${offsetY < 0 ? offsetY : 0}px)`;
  }
}
