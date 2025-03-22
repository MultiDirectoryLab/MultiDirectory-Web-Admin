import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { AppNavigationService } from '@services/app-navigation.service';
import { ContextMenuService } from '@services/contextmenu.service';
import { RightClickEvent, TreeSearchHelper, TreeviewComponent } from 'multidirectory-ui-kit';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navigation',
  styleUrls: ['./navigation.component.scss'],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnDestroy {
  @ViewChild('treeView', { static: true }) treeView!: TreeviewComponent;

  private unsubscribe = new Subject<void>();
  navigationTree: NavigationNode[] = [];

  constructor(
    private navigation: AppNavigationService,
    private contextMenu: ContextMenuService,
  ) {}

  handleRouteChange(navigationTree: NavigationNode[], event: any) {
    let url = event.event.url;
    if (url.startsWith('/')) {
      url = url.substring(1);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  handleNodeSelection(node: NavigationNode) {
    this.navigation.navigate(node);
  }

  handleNodeRightClick(event: RightClickEvent) {
    if (event.node instanceof NavigationNode) {
      this.contextMenu.showContextMenuOnNode(event.event.x, event.event.y, [event.node]);
    }
  }
}
