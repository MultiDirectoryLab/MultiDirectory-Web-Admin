import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { Validator } from "@angular/forms";
import { MdModalComponent, Treenode, TreeviewComponent } from "multidirectory-ui-kit";
import { Observable, Subject } from "rxjs";

export class AttributeListEntry extends Treenode {
    type = '';
    new = false;

    constructor(obj: Partial<AttributeListEntry>) {
        super(obj);
        Object.assign(this, obj);
    }
}

@Component({
    selector: 'app-attribute-list',
    styleUrls: ['./attributes-list.component.scss'],
    templateUrl: './attributes-list.component.html'
})
export class AttributeListComponent implements AfterViewInit {
    @ViewChild('modal', { static: true }) modal: MdModalComponent | null = null;
    @ViewChild('treeview', {static: true}) treeview: TreeviewComponent | null = null;
    private closeRx = new Subject<string[] | null>();
    title = '';
    newAttribute: string = '';
    type: string = '';
    values: string[] = [];

    toDelete: AttributeListEntry[] = [];

    ngAfterViewInit(): void {
    }

    open(title: string, type: string, values: string[]): Observable<string[] | null> {
        this.title = title;
        this.type = type;
        this.values = values ?? [];
        this.treeview!.tree = [];
        this.values.forEach(x => {
            this.treeview?.addRoot(new AttributeListEntry({ 
                name: x, 
                id: x,
                selectable: true,
                type: this.type,
                new: false,
            }));
        });
        this.treeview?.redraw();
        this.modal?.open();
        return this.closeRx.asObservable();
    }

    apply() {
        const result = this.treeview?.tree.map(x => x.name ?? '') ?? [];
        this.closeRx.next(result);
        this.modal?.close();
    }

    close() {
        this.closeRx.next(null);
        this.treeview!.tree = [];
        this.newAttribute = '';
        this.treeview!.redraw();
    }

    addAttribute() {
        this.treeview?.addRoot(new AttributeListEntry({ 
            name: this.newAttribute, 
            id: this.newAttribute,
            selectable: true,
            type: this.type,
            new: true,
        }));
    }

    deleteAttribute() {
        this.toDelete = this.toDelete.concat(<AttributeListEntry[]>this.treeview?.tree.filter(x => x.selected && !(<AttributeListEntry>x).new) ?? []);
        this.treeview!.tree = this.treeview?.tree.filter(x => !x.selected) ?? [];
        this.treeview!.redraw(); 
    }
}