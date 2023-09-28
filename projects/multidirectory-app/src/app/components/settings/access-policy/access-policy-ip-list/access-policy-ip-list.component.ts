import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MdModalComponent, Treenode, TreeviewComponent } from "multidirectory-ui-kit";
import { ToastrService } from "ngx-toastr";
import { IpOption } from "projects/multidirectory-app/src/app/core/access-policy/access-policy-ip-address";
import { Observable, Subject } from "rxjs";

@Component({
    selector: 'app-access-policy-ip-list',
    templateUrl: './access-policy-ip-list.component.html',
    styleUrls: ['./access-policy-ip-list.component.scss']
})
export class AccessPolicyIpListComponent {
    @ViewChild('modal', { static: true }) private _modal!: MdModalComponent;
    @ViewChild('entriesList', { static: true }) private _entriesList!: TreeviewComponent;
    private _ipAddresses: IpOption[] = [];
    private _result = new Subject<IpOption[] | null>();
    input = '';

    constructor(private cdr: ChangeDetectorRef, private toastr: ToastrService) {}

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

    deleteEntry() {
        this._entriesList.tree = this._entriesList.tree.filter(x => !x.selected);
        this._entriesList!.redraw(); 
    }

    addEntry() {
        const validIp = new RegExp(`^(\d{1,3}(\.\d{1,3}){3}( *- *\d{1,3}(\.\d{1,3}){3})?)$`);
        const validSubnet = new RegExp(`^(\d{1,3}(\.\d{1,3}){3}\/\d{1,2})$`);
        if(this.input.match(validIp) || this.input.match(validSubnet)) {
            this._entriesList.addRoot(new Treenode({
                id: this.input,
                name: this.input,
                selectable: true
            }));
            return;
        }
        if(this.input.includes('-')) {
            const parts = this.input.split('-');
            if(parts.length == 2 && parts.every(x => x.match(validIp) || x.match(validSubnet))) {
                this._entriesList.addRoot(new Treenode({
                    id: this.input,
                    name: this.input,
                    selectable: true,
                }));
            }
        }
        this.toastr.error('Формат адреса неверен');
        return;
    }
}