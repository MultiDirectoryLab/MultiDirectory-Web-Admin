import { Injectable, inject } from '@angular/core';
import { MultidirectoryAdapterSettings } from '@core/api/multidirectory-adapter.settings';
import { Observable, Subject, tap } from 'rxjs';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';

export enum WebsocketState {
  INITIAL = 'INITIAL',
  CONNECTED = 'CONNECTED',
  CLOSED = 'CLOSED',
  ERROR = 'ERROR',
  NEVER_EXISTED = 'NEVER_EXISTED',
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
          if (event.code > 0) {
            this._inputRx.next({ status: 'closed', message: event.code + ': ' + event.reason });
          }
          this.disconnect();
        },
        error: (error) => {
          console.log('error');
        },
      },
      openObserver: {
        next: (event: Event) => {
          console.log('WebSocket connected!');
        },
        error: (error) => {
          console.log('error');
        },
      },
    };
    this.socketSubject = new WebSocketSubject(this.config);
  }

  connect() {
    if (!this.socketSubject) {
      return;
    }
    this.socketSubject.pipe(tap((msg) => this._inputRx.next(msg))).subscribe({
      next: (message) => {},
      error: (error) => {
        this.state = WebsocketState.ERROR;
        throw error;
      },
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
  providedIn: 'root',
})
export class WebSocketService {
  private _settings = inject(MultidirectoryAdapterSettings);

  getBaseUrl(resource: string): string {
    return this._settings.baseUrl + '/' + resource;
  }

  connect(wsUrl: string) {
    if (!wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
      const isHttps = this._settings.baseUrl.includes('https:');
      wsUrl = this.getBaseUrl(wsUrl).replace(/^https?\:\/\//i, '');
      wsUrl = (isHttps ? 'wss://' : 'ws://') + wsUrl;
    }
    const handle = new WebsocketTokenHandle(wsUrl);
    handle.connect();
    return handle;
  }
}
