import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { TableColumn } from "@swimlane/ngx-datatable";
import { LdapNode, LdapTreeBuilder } from "../../core/ldap/ldap-tree-builder";
import { SearchEntry } from "../../models/entry/search-response";

export interface TableRow {
    name: string,
    type?: string,
    description: string;
}

@Component({
    selector: 'app-catalog-content',
    templateUrl: './catalog-content.component.html',
    styleUrls: ['./catalog-content.component.scss']
})
export class CatalogContentComponent {
    private _parentNode?: LdapNode;
    get parentNode(): LdapNode | undefined { return this._parentNode; }
    @Input() set parentNode(val: LdapNode | undefined) { 
        this._parentNode = val; 
        this.loadData()
    }

    rows: TableRow[] = [
        { name: 'Test', type: 'Организационная единица', description: 'Здесь будет пример описания, пример описания' },
        { name: 'crm365', type: 'Пользователь', description: 'Здесь будет пример описания, пример описания' },
        { name: 'Max G', type: 'Пользователь', description: 'Здесь будет пример описания, пример описания' },
        { name: 'PrivReportingGroup {d7e66b91-9883-4cd9-8998-125e0e97967f}', type: 'Группа безопасности', description: 'Здесь будет пример описания, пример описания' },
        { name: 'PrivUserGroup {d7e66b91-9883-4cd9-8998-125e0e97967f}', type: 'Группа безопасности', description: 'Здесь будет пример описания, пример описания' },
        { name: 'ReportingGroup {d7e66b91-9883-4cd9-8998-125e0e97967f}', type: 'Группа безопасности', description: 'Здесь будет пример описания, пример описания' }
    ];

    columns: TableColumn[] = [
        { name: 'Имя', prop: 'name', flexGrow: 1 },
        { name: 'Тип', prop: 'type', flexGrow: 1 },
        { name: 'Описание', prop: 'description', flexGrow: 3 }
    ];

    constructor(private ldap: LdapTreeBuilder, private cdr: ChangeDetectorRef) {}

    loadData() {
        if(!this._parentNode?.entry?.object_name) {
            return;
        }
        this.ldap.getContent(this._parentNode.entry.object_name).subscribe(x => {
            this.rows = x.map(node => <TableRow>{
                name: node.name ?? '',
                type: node.entry ? this.getType(node.entry) : '',
                description: ''
            });
            this.cdr.detectChanges();
        });
    }


    getType(entry: SearchEntry): string | undefined {
        const objectClass = entry.partial_attributes.find(x => x.type == 'objectClass');
        if(objectClass?.vals.includes('group')) {
            return 'Группа безопасности';
        }
        if(objectClass?.vals.includes('user')) {
            return 'Пользователь';
        }
        if(objectClass?.vals.includes('organizationalUnit')) {
            return 'Орагнизационная единица';
        }
        console.log(objectClass);
        return '';
    }
}

