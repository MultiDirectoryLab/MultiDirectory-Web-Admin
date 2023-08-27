import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, QueryList, ViewChild, ViewChildren, forwardRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BaseViewComponent } from "../base-view.component";
import { LdapEntity } from "projects/multidirectory-app/src/app/core/ldap/ldap-loader";
import { GridItemComponent } from "./grid-item/grid-item.component";
import { DropdownMenuComponent, PagerComponent } from "multidirectory-ui-kit";
import { CdkDrag, CdkDragDrop, CdkDragEnd, DragRef, moveItemInArray } from "@angular/cdk/drag-drop";
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
    @ViewChild('grid', { static: false }) grid!: ElementRef<HTMLElement>;
    @ViewChild('gridMenu') gridMenu!: DropdownMenuComponent;
    @ViewChild('pager') pager!: PagerComponent;
    items: LdapEntity[] = [];
    alignItems = true;
    constructor(public toast: ToastrService, private cdr: ChangeDetectorRef, private navigation: LdapNavigationService) {
        super()
    }
    ngAfterViewInit(): void {
    }

    override setContent(items: LdapEntity[], selectedNodes: LdapEntity[]): void {
        if(items.length > this.page.size) {
            items = items.slice(0, this.page.size);
        }
        this.items = items;
        this.page.totalElements = this.selectedCatalog!.childCount!;
        this.items.forEach(element => {
            element.selected = selectedNodes.findIndex(y => y.id == element.id) > -1;
        });
        this.pager.updatePager();
        this.cdr.detectChanges();
    }
    override getSelected(): LdapEntity[] {
        return this.items.filter(x => x.selected);
    }
    override setSelected(selected: LdapEntity[]): void {
        this.items.forEach(i => i.selected = false);
        selected.filter(i => !!i).forEach(i => i.selected = true);
        this.cdr.detectChanges();
    }

    resetItems() {
        this.gridDrags.forEach(x => {
            x.reset();
            x.getRootElement().style.gridArea = '';
        });
    }

    showGridContextMenu(event: MouseEvent) {
        event.preventDefault();
        this.gridMenu.setPosition(event.x, event.y);
        this.gridMenu.toggle();
    }

    drop(event: CdkDragDrop<LdapEntity[]>) {
        moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    }
 
    onDrop(event: CdkDragEnd) {
        if(!this.alignItems) {
            return;
        }
        const pos = event.dropPoint;
        const dragRef = event.source;
        const cellWidth = 64 + 8;
        const cellHeight = 64 + 8;
        
        const offsetLeft = this.grid.nativeElement.offsetLeft;
        const offsetTop = this.grid.nativeElement.offsetTop;

        let gridXPos = Math.floor((pos.x - offsetLeft) / cellWidth) + 1;
        let gridYPos = Math.floor((pos.y - offsetTop) / cellHeight) + 1;
        dragRef.reset();
        const el = dragRef.getRootElement();
        let oddIteration = 0;
        while(this.isCellOccupied(gridXPos, gridYPos)) {
            if(oddIteration % 2 == 0) 
                gridXPos += 1;
            else
                gridYPos += 1;
            oddIteration++;
        }
        el.style.gridArea = `${gridYPos} / ${gridXPos}`;
    }

    isCellOccupied(xPos: number, yPos: number) {
        return this.gridDrags.some(x => {
            const el = x.getRootElement()
            if(!el.style.gridArea) {
                return false;
            } 
            const pos = el.style.gridArea.split('/');
            return Number(pos[0]) == yPos && Number(pos[1]) == xPos;
        });
    }
    selectCatalog(item: LdapEntity) {
        this.navigation.setCatalog(item);
    }

    clickOutside(event: MouseEvent) {
        this.items.forEach(x => x.selected = false);
    } 

    onGetFocus() {
        const selected = this.getSelected();
        if(selected.length == 0) {
            this.setSelected([this.items[0]]);
        }
    }

    @HostListener('keydown', ['$event']) 
    handleKeyEvent(event: KeyboardEvent) {
        if(event.key == 'ArrowDown' || event.key == 'ArrowRight'
            || event.key == 'ArrowLeft' || event.key == 'ArrowUp') {
            const selectedItems = this.getSelected();
            if(selectedItems.length == 0) {
                this.setSelected([this.items[0]]);
                return;
            }
            let currentIndex = this.items.findIndex( x => x.id == selectedItems[0].id);
            if(event.key == 'ArrowDown' || event.key == 'ArrowRight') {
                currentIndex = (currentIndex + 1) % this.items.length;
            } 
            
            if(event.key == 'ArrowLeft' || event.key == 'ArrowUp') {
                currentIndex = (currentIndex - 1) < 0 ? (this.items.length - 1) : (currentIndex - 1);
            }
            this.setSelected([this.items[currentIndex]]);
        }
        if(event.key == 'Enter') {
            const selectedItems = this.getSelected();
            if(selectedItems.length == 0) {
                this.setSelected([this.items[0]]);
                return;
            }
            this.selectCatalog(selectedItems[0]);
        }
    }
}