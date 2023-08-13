import { AfterViewInit, ChangeDetectorRef, Component, Input, QueryList, ViewChild, ViewChildren, forwardRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BaseViewComponent } from "../base-view.component";
import { LdapNode } from "projects/multidirectory-app/src/app/core/ldap/ldap-loader";
import { DndDropEvent } from "ngx-drag-drop";
import { GridItemComponent } from "./grid-item/grid-item.component";
import { DropdownMenuComponent } from "multidirectory-ui-kit";
import { CdkDrag, CdkDragDrop, DragRef, moveItemInArray } from "@angular/cdk/drag-drop";
import { LdapNavigationService } from "projects/multidirectory-app/src/app/services/ldap-navigation.service";

@Component({
    selector: 'app-icon-view',
    templateUrl: './icon-view.component.html',
    styleUrls: ['./icon-view.component.scss'],
    providers: [
        { provide: BaseViewComponent, useExisting: forwardRef(() => IconViewComponent) }
    ]
})
export class IconViewComponent extends BaseViewComponent implements AfterViewInit {
    @Input() big = false;
    @ViewChildren(GridItemComponent) gridItems!: QueryList<GridItemComponent>;
    @ViewChildren(CdkDrag) gridDrags!: QueryList<CdkDrag>;

    @ViewChild('gridMenu') gridMenu!: DropdownMenuComponent;
    items: LdapNode[] = [];
    alignItems = true;
    constructor(public toast: ToastrService, private cdr: ChangeDetectorRef, private navigation: LdapNavigationService) {
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

    resetItems() {
        this.gridDrags.forEach(x => {
            x.reset();
        });
    }

    showGridContextMenu(event: MouseEvent) {
        event.preventDefault();
        this.gridMenu.setPosition(event.x, event.y);
        this.gridMenu.toggle();
    }

    onDragover(event:DragEvent) {
        console.log("dragover", JSON.stringify(event, null, 2));
    }

    drop(event: CdkDragDrop<LdapNode[]>) {
        moveItemInArray(this.items, event.previousIndex, event.currentIndex);
      }

    computeDragRenderPos(pos: any, dragRef: DragRef) {
        return {x: Math.floor(pos.x / 64) * 64, y: Math.floor(pos.y / 64) * 64}; // will render the element every 30 pixels horizontally
    }

    selectCatalog(item: LdapNode) {
        this.navigation.setCatalog(item);
    }
}