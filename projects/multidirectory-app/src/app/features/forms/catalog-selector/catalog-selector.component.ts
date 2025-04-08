import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { LdapEntryLoader } from '@core/navigation/node-loaders/ldap-entry-loader/ldap-entry-loader';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, ModalInjectDirective, TreeviewComponent } from 'multidirectory-ui-kit';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-catalog-selector',
  templateUrl: './catalog-selector.component.html',
  styleUrls: ['./catalog-selector.component.scss'],
  imports: [TreeviewComponent, TranslocoPipe, ButtonComponent],
})
export class CatalogSelectorComponent implements AfterViewInit, OnDestroy {
  private ldapLoader = inject(LdapEntryLoader);
  private cdr = inject(ChangeDetectorRef);
  private modalControl = inject(ModalInjectDirective);

  @ViewChild('ldapTree', { static: true }) treeView?: TreeviewComponent;
  ldapRoots: LdapEntryNode[] = [];
  private unsubscribe = new Subject<void>();
  private _selectedNode: LdapEntryNode[] = [];

  ngAfterViewInit(): void {
    this.treeView?.nodeSelect.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this._selectedNode = [<LdapEntryNode>x];
      this.cdr.detectChanges();
    });

    this.ldapLoader
      .get()
      .pipe(take(1))
      .subscribe((roots) => {
        this.ldapRoots = roots;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  close() {
    this.modalControl?.close([]);
  }

  finish() {
    this.modalControl?.close(this._selectedNode);
  }
}
