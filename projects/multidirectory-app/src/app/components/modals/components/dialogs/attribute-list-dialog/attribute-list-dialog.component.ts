import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { MultidirectoryUiKitModule, Treenode, TreeviewComponent } from 'multidirectory-ui-kit';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { AttributeListDialogData } from '../../../interfaces/attribute-list-dialog.interface';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DialogService } from '../../../services/dialog.service';

export class AttributeListEntry extends Treenode {
  type = '';
  new = false;

  constructor(obj: Partial<AttributeListEntry>) {
    super(obj);
    Object.assign(this, obj);
  }
}

@Component({
  selector: 'app-attribute-list-dialog',
  standalone: true,
  imports: [DialogComponent, MultidirectoryUiKitModule, TranslocoPipe, FormsModule],
  templateUrl: './attribute-list-dialog.component.html',
  styleUrl: './attribute-list-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeListDialogComponent implements OnInit {
  @ViewChild('treeview', { static: true }) treeview: TreeviewComponent | null = null;
  public newAttribute = '';
  public type = '';
  public tree: AttributeListEntry[] = [];
  public toDelete: AttributeListEntry[] = [];

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef = inject(DialogRef);
  private dialogData: AttributeListDialogData = inject(DIALOG_DATA);

  public title = this.dialogData.title || '';
  public values: string[] = this.dialogData.values || [];

  public ngOnInit(): void {
    this.tree = this.values.map(
      (x) =>
        new AttributeListEntry({
          name: x,
          id: x,
          selectable: true,
          type: this.type,
          new: false,
        }),
    );
  }

  public apply() {
    const result = this.treeview?.tree.map((x) => x.name ?? '') ?? [];
    this.dialogService.close(this.dialogRef, result);
  }

  public close() {
    this.dialogService.close(this.dialogRef, null);
  }

  public addAttribute() {
    this.treeview?.addRoot(
      new AttributeListEntry({
        name: this.newAttribute,
        id: this.newAttribute,
        selectable: true,
        type: this.type,
        new: true,
      }),
    );
  }

  public deleteAttribute() {
    this.toDelete = this.toDelete.concat(
      (this.tree.filter(
        (x) => x.selected && !(x as AttributeListEntry).new,
      ) as AttributeListEntry[]) ?? [],
    );
    this.tree = this.tree.filter((x) => !x.selected) ?? [];
  }
}
