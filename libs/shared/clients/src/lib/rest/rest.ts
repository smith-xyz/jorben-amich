import uuid from 'uuid';
import urlJoin from 'url-join';

export interface RESTOptions {
  name?: string; // providing a name, helpful for tracking otherwise a run time ID will be given
  baseURL?: string; // allows for global use to the singular server
  globalHeaders?: HeaderRecord; // used for all requests
  timeout?: number;
}

/**
 * omit types from node fetch for headers since we will stick to just record<string, string>
 * omit method as we will use class function signatures
 */
export interface RequestOptions
  extends Omit<RequestInit, 'headers' | 'method'> {
  headers: HeaderRecord; // headers provided here can and will override global headers when a matching key is provided
}

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type HeaderRecord = Record<string, string>;

export class REST {
  constructor(
    private readonly config: RESTOptions = {
      name: `RESTClient-${uuid.v4()}`,
      baseURL: '',
      globalHeaders: {},
    }
  ) {
    // validating URL
    if (this.config.baseURL.length > 0) {
      new URL(this.config.baseURL);
    }
  }

  public async get(path: string, options: RequestOptions) {
    return this.request(this.joinBaseToPath(path), 'GET', options);
  }

  public async post(path: string, options: RequestOptions) {
    return this.request(this.joinBaseToPath(path), 'POST', options);
  }

  public async put(path: string, options: RequestOptions) {
    return this.request(this.joinBaseToPath(path), 'PUT', options);
  }

  public async delete(path: string, options: RequestOptions) {
    return this.request(this.joinBaseToPath(path), 'DELETE', options);
  }

  private joinBaseToPath(path: string): string {
    return urlJoin(this.config.baseURL, path);
  }

  private async request(
    url: string,
    method: HTTPMethod,
    options: RequestOptions
  ) {
    return fetch(url, {
      ...options,
      // this is where the override will happen if you provide matching keys
      method,
      headers: {
        ...this.config.globalHeaders,
        ...options.headers,
      },
    });
  }
}
