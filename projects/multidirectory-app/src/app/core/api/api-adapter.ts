import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdapterSettings } from './adapter-settings';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
//
export class ApiAdapter<Settings extends AdapterSettings> {
  constructor(
    private httpClient: HttpClient,
    private _settings: Settings,
    private toastr: ToastrService,
  ) {}

  getBaseUrl(resource: string): URL {
    return new URL(this._settings.baseUrl + '/' + resource);
  }
  post<T>(resource: string, body: any = null): PostRequest<T> {
    const url = this.getBaseUrl(resource);
    return new PostRequest<T>(url.href, body, this.httpClient, this.toastr);
  }

  patch<T>(resource: string, body: any = null): PatchRequest<T> {
    const url = this.getBaseUrl(resource);
    return new PatchRequest<T>(url.href, body, this.httpClient, this.toastr);
  }

  delete<T>(resource: string, body: any = null): DeleteRequest<T> {
    const url = this.getBaseUrl(resource);
    return new DeleteRequest<T>(url.href, body, this.httpClient, this.toastr);
  }

  get<T>(resource: string): GetRequest<T> {
    const url = this.getBaseUrl(resource);
    return new GetRequest<T>(url.href, this.httpClient, this.toastr);
  }

  put<T>(resource: string, body: any = null): PutRequest<T> {
    const url = this.getBaseUrl(resource);
    return new PutRequest<T>(url.href, body, this.httpClient, this.toastr);
  }

  postFile(resource: string, body: any = null): Observable<any> {
    const url = this.getBaseUrl(resource);
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.httpClient.post(url.toString(), body, httpOptions);
  }
}

export abstract class HttpRequest<ResponseType> {
  httpOptions = {
    headers: new HttpHeaders(),
  };

  constructor(
    protected url: string,
    protected httpClient: HttpClient,
    protected toastr: ToastrService,
  ) {}

  abstract execute(): Observable<ResponseType>;
}

export class PostRequest<ResponseType> extends HttpRequest<ResponseType> {
  constructor(
    url: string,
    private body: any,
    httpClient: HttpClient,
    toastr: ToastrService,
  ) {
    super(url, httpClient, toastr);
  }

  useUrlEncodedForm(): PostRequest<ResponseType> {
    this.httpOptions.headers = this.httpOptions.headers.set(
      'Content-Type',
      'application/x-www-form-urlencoded',
    );
    return this;
  }

  override execute(): Observable<ResponseType> {
    return this.httpClient.post<ResponseType>(this.url, this.body, this.httpOptions);
  }
}

export class PutRequest<ResponseType> extends HttpRequest<ResponseType> {
  constructor(
    url: string,
    private body: any,
    httpClient: HttpClient,
    toastr: ToastrService,
  ) {
    super(url, httpClient, toastr);
  }

  useUrlEncodedForm(): PutRequest<ResponseType> {
    this.httpOptions.headers = this.httpOptions.headers.set(
      'Content-Type',
      'application/x-www-form-urlencoded',
    );
    return this;
  }

  override execute(): Observable<ResponseType> {
    return this.httpClient.put<ResponseType>(this.url, this.body, this.httpOptions);
  }
}

export class PatchRequest<ResponseType> extends HttpRequest<ResponseType> {
  constructor(
    url: string,
    private body: any,
    httpClient: HttpClient,
    toastr: ToastrService,
  ) {
    super(url, httpClient, toastr);
  }

  useUrlEncodedForm(): PatchRequest<ResponseType> {
    this.httpOptions.headers = this.httpOptions.headers.set(
      'Content-Type',
      'application/x-www-form-urlencoded',
    );
    return this;
  }

  override execute(): Observable<ResponseType> {
    return this.httpClient.patch<ResponseType>(this.url, this.body, this.httpOptions);
  }
}

export class GetRequest<ResponseType> extends HttpRequest<ResponseType> {
  constructor(url: string, httpClient: HttpClient, toastr: ToastrService) {
    super(url, httpClient, toastr);
  }

  override execute(): Observable<ResponseType> {
    return this.httpClient.get<ResponseType>(this.url, this.httpOptions);
  }
}

export class DeleteRequest<ResponseType> extends HttpRequest<ResponseType> {
  constructor(
    url: string,
    private body: any,
    httpClient: HttpClient,
    toastr: ToastrService,
  ) {
    super(url, httpClient, toastr);
  }

  useUrlEncodedForm(): DeleteRequest<ResponseType> {
    this.httpOptions.headers = this.httpOptions.headers.set(
      'Content-Type',
      'application/x-www-form-urlencoded',
    );
    return this;
  }

  override execute(): Observable<ResponseType> {
    return this.httpClient.delete<ResponseType>(this.url, {
      headers: this.httpOptions.headers,
      body: this.body,
    });
  }
}
