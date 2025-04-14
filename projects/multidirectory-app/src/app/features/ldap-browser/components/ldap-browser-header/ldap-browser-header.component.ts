import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { translate, TranslocoPipe } from '@jsverse/transloco';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ldap-browser-header',
  templateUrl: './ldap-browser-header.component.html',
  styleUrls: ['./ldap-browser-header.component.scss'],
  imports: [TranslocoPipe, FaIconComponent],
})
export class LdapBrowserHeaderComponent implements AfterViewInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  selectedCatalogDn = '';
  containerName = '';
  faCopy = faCopy;
  private unsubscribe = new Subject<boolean>();

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.selectedCatalogDn = this.activatedRoute.snapshot.queryParams['distinguishedName'];
      this.containerName = this.selectedCatalogDn;
      this.cdr.detectChanges();
    });
  }

  onCopyDn() {
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
