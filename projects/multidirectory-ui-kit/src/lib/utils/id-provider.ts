export class IdProvider {
    static _id = 0;
    static getUniqueId(base: string): string {
        const data = 'ID' + base + (IdProvider._id)++ + '';
        return data;
    }
}