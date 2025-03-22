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
  @Input() nodeLabelTemplate: TemplateRef<any> | null = null;
  @Input() checkboxes = false;
  @Output() nodeSelect = new EventEmitter<Treenode>();
  @Output() nodeRightClick = new EventEmitter<RightClickEvent>();
  @Output() nodeExpandClick = new EventEmitter<Treenode>();

  private _selectedNode: Treenode | null = null;
  private _focusedNode: Treenode | null = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (!this.nodeLabelTemplate) {
      this.nodeLabelTemplate = this.defaultLabel;
    }
  }

  handleNodeClick(event: Event, node: Treenode) {
    event.stopPropagation();
    TreeSearchHelper.traverseTree(this.tree, (x) => {
      x.selected = false;
    });
    node.selected = !node.selected;
    this.nodeSelect.emit(node);
  }

  handleExpandClick(event: Event, node: Treenode) {
    event.stopPropagation();
    this.nodeExpandClick.emit(node);
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
