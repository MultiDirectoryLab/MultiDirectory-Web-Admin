export class MultiselectModel {
    id: string = '';
    title: string = '';
    badge_title?: string;
    selected = false;
    key = '';

    constructor(obj: Partial<MultiselectModel>) {
        Object.assign(this, obj);
    }
}