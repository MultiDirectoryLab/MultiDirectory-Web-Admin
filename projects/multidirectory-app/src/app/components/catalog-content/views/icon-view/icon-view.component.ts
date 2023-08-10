import { AfterViewInit, ChangeDetectorRef, Component, forwardRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BaseViewComponent } from "../base-view.component";
import { LdapNode } from "projects/multidirectory-app/src/app/core/ldap/ldap-loader";
import { DndDropEvent } from "ngx-drag-drop";

@Component({
    selector: 'app-icon-view',
    templateUrl: './icon-view.component.html',
    styleUrls: ['./icon-view.component.scss'],
    providers: [
        { provide: BaseViewComponent, useExisting: forwardRef(() => IconViewComponent) }
    ]
})
export class IconViewComponent extends BaseViewComponent implements AfterViewInit {
    items: LdapNode[] = [];

    constructor(public toast: ToastrService, private cdr: ChangeDetectorRef) {
        super()
    }
    ngAfterViewInit(): void {
        this.toast.info('Данный раздел находится в разразботке');
    }

    override setContent(items: LdapNode[], selectedNodes: LdapNode[]): void {
        this.items = items;
    }
    override getSelected(): LdapNode[] {
        return this.items.filter(x => x.selected);
    }
    override setSelected(selected: LdapNode[]): void {
        this.items.forEach(i => i.selected = false);
        selected.forEach(i => i.selected = true);
        this.cdr.detectChanges();
    }

    onDragover(event:DragEvent) {
        console.log("dragover", JSON.stringify(event, null, 2));
    }

    onDrop(event:DndDropEvent) {
        return;
        console.log("dropped", JSON.stringify(event, null, 2));
        var offset = event!.event.dataTransfer!.getData("text/plain").split(',');
        var dm = <HTMLElement>event.event.target;
        dm.style.left = (event.event.clientX + parseInt(offset[0],10)) + 'px';
        dm.style.top = (event.event.clientY + parseInt(offset[1],10)) + 'px';
        event.event.preventDefault();
        return false;
    }
}