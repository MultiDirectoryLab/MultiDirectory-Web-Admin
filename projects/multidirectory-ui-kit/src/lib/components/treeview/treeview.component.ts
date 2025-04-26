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
import { RightClickEvent } from './model/right-click-event';
import { Treenode } from './model/treenode';

@Component({
  selector: 'md-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, NgClass, NgStyle, CheckboxComponent, FormsModule],
})
export class TreeviewComponent extends BaseControlComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  @ViewChild('defaultLabel', { static: true }) defaultLabel!: TemplateRef<any>;
  @Input() tree: Treenode[] = [];
  @Input() nodeLabelTemplate: TemplateRef<any> | null = null;
  @Input() checkboxes = false;
  @Output() nodeSelect = new EventEmitter<Treenode>();
  @Output() nodeRightClick = new EventEmitter<RightClickEvent>();
  @Output() nodeExpandClick = new EventEmitter<Treenode>();

  ngOnInit(): void {
    if (!this.nodeLabelTemplate) {
      this.nodeLabelTemplate = this.defaultLabel;
    }
  }

  handleNodeClick(event: Event, node: Treenode) {
    event.stopPropagation();
    const wasSelected = node.selected;
    TreeSearchHelper.traverseTree(this.tree, (x) => {
      x.selected = false;
    });
    node.selected = true;
    if (!wasSelected) {
      this.nodeSelect.emit(node);
    } else {
      node.expanded = !node.expanded;
      this.nodeExpandClick.emit(node);
    }
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

  @HostListener('keydown', ['$event'])
  handleKeyEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowUp') {
      // parent
      // let nextNode = TreeSearchHelper.findPrevious(this.tree, this._focusedNode);
      // this.setNodeFocused(nextNode);
    }
    if (event.key == 'ArrowDown') {
      // const sibling = TreeSearchHelper.findNext(this.tree, this._focusedNode);
      // if (sibling) {
      //  this.setNodeFocused(sibling);
      // }
    }
    if (event.key == 'ArrowRight' || event.key == 'Enter') {
      // expand + child
      // let nextNode = this._focusedNode ?? null;
      // if (nextNode) {
      //  this.expand(nextNode);
      // }
    }
    if (event.key == 'ArrowLeft') {
      // parent + collapse
      // let nextNode = this._focusedNode;
      // if (nextNode?.parent && nextNode?.parent?.id !== 'root') {
      //  nextNode.expanded = false;
      //  this.cdr.detectChanges();
      //}
    }
  }
}
