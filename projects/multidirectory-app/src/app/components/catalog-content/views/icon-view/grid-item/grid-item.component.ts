import { Component, Input, ViewChild } from "@angular/core";
import { LdapNode } from "projects/multidirectory-app/src/app/core/ldap/ldap-loader";


@Component({
    selector: 'app-grid-item',
    styleUrls: ['./grid-item.component.scss'],
    templateUrl: 'grid-item.component.html'
})
export class GridItemComponent {
    @Input() item!: LdapNode;
    draggable = {
        data: "myDragData",
        effectAllowed: 'copyMove',
        disable: false,
        handle: false
      };
      
    onDragStart(event:DragEvent) {
        console.log("drag started", JSON.stringify(event, null, 2));
    }
    
    onDragEnd(event:DragEvent) {
        console.log("drag ended", JSON.stringify(event, null, 2));
      }
    
      onDraggableCopied(event:DragEvent) {
        console.log("draggable copied", JSON.stringify(event, null, 2));
      }
    
      onDraggableLinked(event:DragEvent) {
    
        console.log("draggable linked", JSON.stringify(event, null, 2));
      }
    
      onDraggableMoved(event:DragEvent) {
    
        console.log("draggable moved", JSON.stringify(event, null, 2));
      }
    
      onDragCanceled(event:DragEvent) {
        console.log("drag cancelled", JSON.stringify(event, null, 2));
      }
    

    
}