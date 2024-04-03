import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { DropdownMenuComponent } from "multidirectory-ui-kit";
import { LdapEntryNode } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity";
import { LdapEntryType } from "projects/multidirectory-app/src/app/core/ldap/ldap-entity-type";
import { AppWindowsService } from "projects/multidirectory-app/src/app/services/app-windows.service";
import { ContextMenuService } from "projects/multidirectory-app/src/app/services/contextmenu.service";
import { Subject, take, takeUntil } from "rxjs";

@Component({
    selector: 'app-contextmenu',
    templateUrl: './contextmenu.component.html',
    styleUrls: ['./contextmenu.component.scss']
})
export class ContextMenuComponent implements AfterViewInit, OnDestroy {
    @ViewChild('contextMenu', { static: true }) contextMenuRef!: DropdownMenuComponent;
    private unsubscribe = new Subject<void>();
    LdapEntryType = LdapEntryType;
    entry?: LdapEntryNode;
    constructor(private contextMenuService: ContextMenuService, private windows: AppWindowsService) {

    }
    ngAfterViewInit(): void {
        this.contextMenuService.contextMenuOnNodeRx.pipe(
            takeUntil(this.unsubscribe)
        ).subscribe(x => {
            this.entry = x.entry;
            this.contextMenuRef.setPosition(x.openX, x.openY);
            this.contextMenuRef.open();
        });
    }
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    isSelectedRowsOfType(type: LdapEntryType): boolean {
        return this.entry?.type == type;
    }
 
    showEntryProperties() {
        if(!this.entry) {
            return;
        }
        this.windows.openEntityProperiesModal(this.entry).pipe(take(1)).subscribe(x => {
            alert('2');
        })
    }
    showChangePassword() {}
    showDeleteConfirmation() {}
}