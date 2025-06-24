import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  CatalogSelectorDialogData,
  CatalogSelectorDialogReturnData,
} from '../../../interfaces/catalog-selector-dialog.interface';
import { MultidirectoryUiKitModule, Treenode, TreeviewComponent } from 'multidirectory-ui-kit';
import { from, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { NavigationNode } from '@models/core/navigation/navigation-node';
import { LdapTreeviewService } from '@services/ldap/ldap-treeview.service';

@Component({
  selector: 'app-catalog-selector-dialog',
  standalone: true,
  imports: [DialogComponent, MultidirectoryUiKitModule, TranslocoPipe],
  templateUrl: './catalog-selector-dialog.component.html',
  styleUrl: './catalog-selector-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogSelectorDialogComponent implements OnInit {
  @ViewChild('ldapTree', { static: true }) treeView?: TreeviewComponent;

  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<CatalogSelectorDialogReturnData, CatalogSelectorDialogComponent> =
    inject(DialogRef);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private ldapTreeview = inject(LdapTreeviewService);
  private _selectedNode: NavigationNode[] = [];
  ldapRoots: NavigationNode[] = [];

  ngOnInit(): void {
    from(this.ldapTreeview.load(''))
      .pipe(take(1))
      .subscribe((newNodes) => {
        this._selectedNode = [newNodes[0]];
        this.ldapRoots = newNodes;
        this.cdr.detectChanges();
      });

    this.treeView?.nodeSelect.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((x) => {
      this._selectedNode = [x as NavigationNode];
      this.cdr.detectChanges();
    });
  }

  onExpandClick(node: Treenode) {
    from(this.ldapTreeview.load(node.id))
      .pipe(take(1))
      .subscribe((newNodes) => {
        this.ldapRoots = newNodes;
        this.cdr.detectChanges();
      });
  }

  close() {
    this.dialogService.close(this.dialogRef, []);
  }

  finish() {
    this.dialogService.close(this.dialogRef, this._selectedNode);
  }
}
