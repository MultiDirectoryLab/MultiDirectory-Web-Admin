import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MdModalComponent, Treenode, TreeviewComponent } from "multidirectory-ui-kit";
import { IpOption } from "projects/multidirectory-app/src/app/core/access-policy/access-policy-ip-address";
import { Observable, Subject } from "rxjs";

@Component({
    selector: 'app-access-policy-ip-list',
    templateUrl: './access-policy-ip-list.component.html',
    styleUrls: ['./access-policy-ip-list.component.scss']
})
export class AccessPolicyIpListComponent {
    @ViewChild('modal', { static: true }) private _modal!: MdModalComponent;
    @ViewChild('treeview', {static: true}) private _treeview!: TreeviewComponent;

    private _ipAddresses: IpOption[] = [];
    private _result = new Subject<IpOption[] | null>();
    entries: Treenode[] = [];
    inputMode: number = 0;
    singleInput = '';
    rangeStart = '';
    rangeEnd = '';

    constructor(private cdr: ChangeDetectorRef) {}


    open(ipAddresses: IpOption[]): Observable<IpOption[] | null> {
        this._ipAddresses = ipAddresses;
        this._modal.open();
        return this._result.asObservable();    
    }

    finish() {
        this._result.next(this._ipAddresses);
        this._modal.close();
    }
    
    close()  {
        this._result.next(null);
        this._modal.close();
    }

    delete() {

    }

    addEntry() {
        this.entries.push(new Treenode({
            id: this.singleInput,
            name: this.singleInput,
            selectable: true
        }));
        
        console.log(this.entries);
        this.cdr.detectChanges();
    }
}