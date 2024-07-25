import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { translate } from '@ngneat/transloco';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ldap-browser-header',
  templateUrl: './ldap-browser-header.component.html',
  styleUrls: ['./ldap-browser-header.component.scss'],
})
export class LdapBrowserHeaderComponent implements AfterViewInit, OnDestroy {
  private unsubscribe = new Subject<boolean>();
  selectedCatalogDn = '';
  containerName = '';
  faCopy = faCopy;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe((x) => {
      this.selectedCatalogDn = this.activatedRoute.snapshot.queryParams['distinguishedName'];
      this.containerName = this.selectedCatalogDn;
      this.cdr.detectChanges();
    });
  }

  onCopyDn($event: any) {
    navigator.clipboard
      .writeText(this.containerName)
      .then(() => {
        this.toastr.success(translate('header.container-path-copied'));
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
        this.toastr.error(translate('header.container-path-copy-error'), err);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
}
