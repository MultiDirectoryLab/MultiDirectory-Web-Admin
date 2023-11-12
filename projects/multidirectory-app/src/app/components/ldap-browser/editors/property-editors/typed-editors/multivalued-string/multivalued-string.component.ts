import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { AttributeListEntry } from "../../../attributes-list/attributes-list.component";
import { TreeviewComponent } from "multidirectory-ui-kit";
import { TypedEditorBaseComponent } from "../typed-editor-base.component";
import { id } from "@swimlane/ngx-datatable";

@Component({
    selector: 'app-multivalued-string-editor',
    templateUrl: './multivalued-string.component.html',
    styleUrls: ['./multivalued-string.component.scss']
}) 
export class MultivaluedStringComponent extends TypedEditorBaseComponent {
    @ViewChild('treeview', {static: true}) treeview: TreeviewComponent | null = null;
    newAttribute: string = '';
    type: string = '';

    @Input() override set propertyValue(val: string) {
        this._propertyValue = this.treeview?.tree.map(x => x?.name ?? '').join(';') ?? '';
        this.treeview!.tree = [];
        val.split(';').map(x => new AttributeListEntry({
            name: x,
            id: x,
            type: this.type,
            selectable: true
        })).forEach(x => this.treeview!.tree.push(x));
        this.treeview?.redraw();
    }

    constructor(private cdr: ChangeDetectorRef) {
        super();
    }

    addAttribute() {
        this.treeview?.addRoot(new AttributeListEntry({ 
            name: this.newAttribute, 
            id: this.newAttribute,
            selectable: true,
            type: this.type,
            new: true,
        }));
        this._propertyValue = this.treeview?.tree.map(x => x?.name ?? '').join(';') ?? '';
        this.propertyValueChange.next(this._propertyValue);
        this.newAttribute = '';
    }

    deleteAttribute() {
        this.treeview!.tree = this.treeview?.tree.filter(x => !x.selected) ?? [];
        this._propertyValue = this.treeview?.tree.map(x => x?.name ?? '').join(';') ?? '';
        this.propertyValueChange.next(this._propertyValue);
        this.treeview!.redraw(); 
    }
}