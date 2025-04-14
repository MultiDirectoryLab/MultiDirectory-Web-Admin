import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of, take } from 'rxjs';
import { BaseControlComponent } from '../base-component/control.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { TreeSearchHelper } from './core/tree-search-helper';
import { ExpandStrategy } from './model/expand-strategy';
import { RightClickEvent } from './model/right-click-event';
import { Treenode } from './model/treenode';
import { TreeItemComponent } from './tree-item.component';

@Component({
  selector: 'md-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, TreeItemComponent, NgClass, NgStyle, CheckboxComponent, FormsModule],
})
export class TreeviewComponent extends BaseControlComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  private _selectedNode: Treenode | null = null;
  private _focusedNode: Treenode | null = null;
  @ViewChild('defaultLabel', { static: true }) defaultLabel!: TemplateRef<any>;
  @Input() tree: Treenode[] = [];
  @Input() expandStrategy = ExpandStrategy.AlwaysUpdate;
  @Input() nodeLabel: TemplateRef<any> | null = null;
  @Input() checkboxes = false;
  @Output() nodeSelect = new EventEmitter<Treenode>();
  @Output() nodeRightClick = new EventEmitter<RightClickEvent>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (!this.nodeLabel) {
      this.nodeLabel = this.defaultLabel;
    }
  }

  addRoot(node: Treenode) {
    this.tree.push(node);
    this.cdr.detectChanges();
  }

  expand(node: Treenode) {
    if (!node.selected && node.selectable && node.expanded) {
      this.setNodeSelected(node);
      return;
    }
    this.setNodeExpanded(node, !node.expanded).subscribe((x) => {
      node.children = x;
      if (node.selectable) {
        this.setNodeSelected(node);
      }
      this.cdr.detectChanges();
    });
  }

  select(toSelect: Treenode | null) {
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
    this.loadChildren(toSelect)
      .pipe(take(1))
      .subscribe((x) => {
        toSelect!.children = x;
        this.cdr.detectChanges();
      });
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

  private loadChildren(node: Treenode): Observable<Treenode[]> {
    if (!!node.loadChildren && this.expandStrategy == ExpandStrategy.AlwaysUpdate) {
      return node.loadChildren ? node.loadChildren() : of([]);
    }
    return of(node.children);
  }

  private setNodeExpanded(node: Treenode, state: boolean = true): Observable<Treenode[]> {
    node.expanded = state;
    if (node.expanded) {
      return this.loadChildren(node);
    } else {
      node.children.forEach((x) => this.setNodeExpanded(x, false));
    }
    return of(node.children ?? []);
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
}
