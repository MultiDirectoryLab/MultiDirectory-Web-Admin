export class IdProvider {
    static _id = 0;
    static getUniqueId(): string {
        return (IdProvider._id)++ + '';
    }
}