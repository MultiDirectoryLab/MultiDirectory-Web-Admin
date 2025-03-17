import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { ModalInjectDirective, TreeviewComponent } from 'multidirectory-ui-kit';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-catalog-selector',
  templateUrl: './catalog-selector.component.html',
  styleUrls: ['./catalog-selector.component.scss'],
})
export class CatalogSelectorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ldapTree', { static: true }) treeView?: TreeviewComponent;
  private unsubscribe = new Subject<void>();
  private _selectedNode: LdapEntryNode[] = [];
  ldapRoots: LdapEntryNode[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private modalControl: ModalInjectDirective,
  ) {}

  ngAfterViewInit(): void {
    this.treeView?.nodeSelect.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this._selectedNode = [<LdapEntryNode>x];
      this.cdr.detectChanges();
    });

    // this.ldapLoader
    //   .get()
    //   .pipe(take(1))
    //   .subscribe((roots) => {
    //     this.ldapRoots = roots;
    //     this.cdr.detectChanges();
    //   });
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
