import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { ContextMenuService } from '../../../services/context-menu.service';
import { ContextMenuItem } from '@models/core/context-menu/context-menu-item';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-base-context-menu',
  standalone: true,
  templateUrl: './base-context-menu.component.html',
  styleUrl: './base-context-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseContextMenuComponent {
  menuItems = <ContextMenuItem[]>inject(DIALOG_DATA);

  private contextMenuService: ContextMenuService = inject(ContextMenuService);

  protected emitAction(actionId: string): void {
    this.contextMenuService.close(actionId);
  }
}
