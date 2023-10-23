import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { WebSocketSubject, WebSocketSubjectConfig} from 'rxjs/webSocket';
import { AdapterSettings, MultidirectoryAdapterSettings } from "../api/adapter-settings";

export enum WebsocketState {
    INITIAL = 'INITIAL', 
    CONNECTED = 'CONNECTED',
    CLOSED = 'CLOSED',
    ERROR = 'ERROR',
    NEVER_EXISTED = 'NEVER_EXISTED'
}

export class WebsocketTokenHandle {
    state = WebsocketState.NEVER_EXISTED;
    socketSubject?: WebSocketSubject<any>;

    private _inputRx = new Subject<any>();
    get inputRx(): Observable<any> {
        return this._inputRx.asObservable();
    }
    private readonly config: WebSocketSubjectConfig<any>;

    constructor(url: string) {
        this.state = WebsocketState.INITIAL;
        this.config = {
            url: url,
            binaryType: 'blob',
            closeObserver: {
              next: (event: CloseEvent) => {
                this.disconnect();
              }
            },
            openObserver: {
              next: (event: Event) => {
                console.log('WebSocket connected!');
              }
            }
        };
        this.socketSubject = new WebSocketSubject(this.config);
    }

    connect() {
        if(!this.socketSubject) {
            return;
        }
        this.socketSubject.pipe(
            tap(msg => this._inputRx.next(msg))
        ).subscribe({
            next: (message) => {},
            error: (error) => {
                alert('error');
                this.state = WebsocketState.ERROR;

            }
        });
        this.state = WebsocketState.CONNECTED;
      
    }

    send(data: any) {
        return this.socketSubject?.next(data);
    }

    disconnect() {
        this.socketSubject?.complete();
        this.socketSubject = undefined;
        this.state = WebsocketState.CLOSED;
    }
}

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
  constructor(private _settings: MultidirectoryAdapterSettings) {}

  getBaseUrl(resource: string): string {
      return this._settings.baseUrl + '/' + resource;
  }

  connect(wsUrl: string) {
      if(!wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
        wsUrl = this.getBaseUrl(wsUrl).replace(/^https?\:\/\//i, "");;
        wsUrl = 'ws://' + wsUrl;
      }
      const handle = new WebsocketTokenHandle(wsUrl);
      handle.connect();
      return handle;
  }
}