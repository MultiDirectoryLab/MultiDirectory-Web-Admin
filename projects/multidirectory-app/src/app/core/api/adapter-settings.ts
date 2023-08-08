import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

export interface AdapterSettings {
    baseUrl: string
}

@Injectable({
    providedIn: 'root'
})
export class MultidirectoryAdapterSettings {
    baseUrl = environment.multidirectoryApiUrl

    constructor() {
        if(!this.baseUrl.startsWith('http://') && !this.baseUrl.startsWith('https://')) {
            this.baseUrl = 'http://' + this.baseUrl
        }
    }
} 