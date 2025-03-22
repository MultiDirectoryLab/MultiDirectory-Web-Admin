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
import { BaseControlComponent } from '../base-component/control.component';
import { RightClickEvent } from './model/right-click-event';

@Component({
  selector: 'md-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeviewComponent extends BaseControlComponent implements OnInit {
  @ViewChild('defaultLabel', { static: true }) defaultLabel!: TemplateRef<any>;
  @Input() tree: Treenode[] = [];
  @Input() nodeLabelTemplate: TemplateRef<any> | null = null;
  @Input() checkboxes = false;
  @Output() nodeSelect = new EventEmitter<Treenode>();
  @Output() nodeRightClick = new EventEmitter<RightClickEvent>();
  @Output() nodeExpandClick = new EventEmitter<Treenode>();

  constructor(private cdr: ChangeDetectorRef) {
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
}
