export class IdProvider {
    static _id = 0;
    static getUniqueId(base: string): string {
        return 'ID' + base + (IdProvider._id)++ + '';
    }
}