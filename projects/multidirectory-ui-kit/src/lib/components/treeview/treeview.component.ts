import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Observable, Subject, lastValueFrom, of, take } from 'rxjs';
import { Treenode } from './model/treenode';
import { TreeSearchHelper } from './core/tree-search-helper';
import { ExpandStrategy } from './model/expand-strategy';
import { RightClickEvent } from './model/right-click-event';
import { BaseControlComponent } from '../base-component/control.component';

@Component({
  selector: 'md-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeviewComponent extends BaseControlComponent implements OnInit {
  @ViewChild('defaultLabel', { static: true }) defaultLabel!: TemplateRef<any>;
  @Input() tree: Treenode[] = [];
  @Input() expandStrategy = ExpandStrategy.AlwaysUpdate;
  @Input() nodeLabelTemplate: TemplateRef<any> | null = null;
  @Input() checkboxes = false;
  @Output() nodeSelect = new EventEmitter<Treenode>();
  @Output() nodeRightClick = new EventEmitter<RightClickEvent>();
  private _selectedNode: Treenode | null = null;
  private _focusedNode: Treenode | null = null;

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    if (!this.nodeLabelTemplate) {
      this.nodeLabelTemplate = this.defaultLabel;
    }
  }

  private async loadChildren(node: Treenode): Promise<Treenode[]> {
    if (!!node.loadChildren && this.expandStrategy == ExpandStrategy.AlwaysUpdate) {
      return node.loadChildren ? await node.loadChildren() : Promise.resolve([]);
    }
    return Promise.resolve(node.children);
  }

  private setNodeExpanded(node: Treenode, state: boolean = true): Promise<Treenode[]> {
    node.expanded = state;
    if (node.expanded) {
      return this.loadChildren(node);
    } else {
      node.children.forEach((x) => this.setNodeExpanded(x, false));
    }
    return Promise.resolve(node.children ?? []);
  }

  private setNodeSelected(node: Treenode) {
    this.setNodeFocused(null);
    if (node.selectable) {
      TreeSearchHelper.traverseTree(this.tree, (node, path) => {
        node.selected = false;
      });
      node.selected = true;
      this._selectedNode = node;
      this.nodeSelect.emit(node);
      this.cdr.detectChanges();
    }
  }

  private setNodeFocused(node: Treenode | null) {
    TreeSearchHelper.traverseTree(
      this.tree,
      (node, path) => {
        node.focused = false;
      },
      [],
    );
    this._focusedNode = null;
    if (node) {
      node.focused = true;
      this._focusedNode = node;
    }
  }

  addRoot(node: Treenode) {
    this.tree.push(node);
    this.cdr.detectChanges();
  }

  async expand(node: Treenode) {
    if (!node.selected && node.selectable && node.expanded) {
      this.setNodeSelected(node);
      return;
    }
    const result = await this.setNodeExpanded(node, !node.expanded);

    node.children = result;
    if (node.selectable) {
      this.setNodeSelected(node);
    }
    this.cdr.detectChanges();
  }

  async select(toSelect: Treenode | null) {
    let nodePath: Treenode[] = [];

    if (!toSelect) {
      // Clear the selection
      TreeSearchHelper.traverseTree(this.tree, (n, path) => {
        n.selected = false;
      });
      this.cdr.detectChanges();
      return;
    }

    // Search a tree for a toSelect rote path
    TreeSearchHelper.traverseTree(this.tree, (n, path) => {
      n.selected = false;
      if (n.id == toSelect!.id) {
        nodePath = [...path];
        toSelect = n;
      }
    });

    // Expand Every Node on the route path
    nodePath.forEach((x) => {
      x.expanded = true;
      x.selected = false;
    });

    toSelect.selected = true;
    toSelect.expanded = true;
    const result = await this.loadChildren(toSelect);
    toSelect!.children = result;
    this.cdr.detectChanges();
  }

  focus(node: Treenode) {
    TreeSearchHelper.traverseTree(this.tree, (n, path) => {
      n.focused = false;
    });
    node.focused = true;
  }

  @HostListener('keydown', ['$event'])
  handleKeyEvent(event: KeyboardEvent) {
    if (!this._focusedNode) {
      this._focusedNode = this._selectedNode ?? this.tree[0];
    }
    if (event.key == 'ArrowUp') {
      // parent
      let nextNode = TreeSearchHelper.findPrevious(this.tree, this._focusedNode);
      this.setNodeFocused(nextNode);
    }
    if (event.key == 'ArrowDown') {
      const sibling = TreeSearchHelper.findNext(this.tree, this._focusedNode);
      if (sibling) {
        this.setNodeFocused(sibling);
      }
    }
    if (event.key == 'ArrowRight' || event.key == 'Enter') {
      // expand + child
      let nextNode = this._focusedNode ?? null;
      if (nextNode) {
        this.expand(nextNode);
      }
    }
    if (event.key == 'ArrowLeft') {
      // parent + collapse
      let nextNode = this._focusedNode;
      if (nextNode?.parent && nextNode?.parent?.id !== 'root') {
        nextNode.expanded = false;
        this.cdr.detectChanges();
      }
    }
  }

  handleNodeClick(event: Event, node: Treenode) {
    event.stopPropagation();
    this.expand(node);
  }

  handleRightClick(event: MouseEvent, node: Treenode) {
    event.stopPropagation();
    event.preventDefault();

    this.nodeRightClick.emit({ event: event, node: node });
  }

  redraw() {
    this.cdr.detectChanges();
  }
}
