import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { translate } from "@ngneat/transloco";
import { ToastrService } from "ngx-toastr";
import { LdapEntryNode } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'app-ldap-browser-header',
    templateUrl: './ldap-browser-header.component.html',
    styleUrls: ['./ldap-browser-header.component.scss'],
})
export class LdapBrowserHeaderComponent implements AfterViewInit, OnDestroy{
    selectedCatalog: LdapEntryNode | null = null;
    containerName = '';
    unsubscribe = new Subject<boolean>();

    constructor(
        private cdr: ChangeDetectorRef,
        private toastr: ToastrService) {}

    ngAfterViewInit(): void {
        /*this.navigation.selectedCatalogRx.pipe(takeUntil(this.unsubscribe)).subscribe(catalog => {
            this.selectedCatalog = catalog;
            const catalogId = catalog?.id 
            if(!!catalogId) {
                this.containerName = catalogId;
            } else if(catalog?.entry?.object_name?.trim()) {
                this.containerName = catalog?.entry?.object_name?.trim();
            } else {
                this.containerName = '';
            }
            this.cdr.detectChanges();
        })*/
    }
    
    onCopyDn($event: any) {
        navigator.clipboard.writeText(this.containerName).then(() => {
            this.toastr.success(translate('header.container-path-copied'));
        }).catch(err => {
            console.error('Could not copy text: ', err);
            this.toastr.error(translate('header.container-path-copy-error'), err);
        });
    }
    ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }
}