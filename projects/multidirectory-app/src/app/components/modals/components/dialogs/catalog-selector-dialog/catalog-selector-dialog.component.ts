import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  ViewChild,
} from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { DialogRef } from '@angular/cdk/dialog';
import { CatalogSelectorDialogReturnData } from '../../../interfaces/catalog-selector-dialog.interface';
import { MultidirectoryUiKitModule, TreeviewComponent } from 'multidirectory-ui-kit';
import { take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { NavigationNode } from '@models/core/navigation/navigation-node';

@Component({
  selector: 'app-catalog-selector-dialog',
  standalone: true,
  imports: [DialogComponent, MultidirectoryUiKitModule, TranslocoPipe],
  templateUrl: './catalog-selector-dialog.component.html',
  styleUrl: './catalog-selector-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogSelectorDialogComponent implements AfterViewInit {
  @ViewChild('ldapTree', { static: true }) treeView?: TreeviewComponent;
  ldapRoots: NavigationNode[] = [];

  private dialogService: DialogService = inject(DialogService);
  private dialogRef: DialogRef<CatalogSelectorDialogReturnData, CatalogSelectorDialogComponent> =
    inject(DialogRef);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  private _selectedNode: NavigationNode[] = [];

  ngAfterViewInit(): void {
    this.treeView?.nodeSelect.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((x) => {
      this._selectedNode = [x as NavigationNode];
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
