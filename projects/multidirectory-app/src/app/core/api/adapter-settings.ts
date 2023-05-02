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
} 