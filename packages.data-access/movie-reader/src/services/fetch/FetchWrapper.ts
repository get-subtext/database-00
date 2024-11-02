import { get } from 'lodash-es';
import type * as T from './FetchWrapper.types';

export class FetchWrapper implements T.FetchWrapper {
  public async getText({ url, headers }: T.GetTextInput): Promise<T.GetTextOutput> {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        return { success: false, status: response.status, body: response.statusText };
      }

      const data = await response.text();
      return { success: true, status: response.status, body: data };
    } catch (error) {
      const message = get(error, 'message', '<unknown>');
      return { success: false, status: 0, body: `Unexpected error: ${message}` };
    }
  }

  public async getJson({ url, headers }: T.GetJsonInput): Promise<T.GetJsonOutput> {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        return { success: false, status: response.status, body: response.statusText };
      }

      const data = await response.json();
      return { success: true, status: response.status, body: data };
    } catch (error) {
      const message = get(error, 'message', '<unknown>');
      return { success: false, status: 0, body: `Unexpected error: ${message}` };
    }
  }

  public async getFile({ url, headers }: T.GetFileInput): Promise<T.GetFileOutput> {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        return { success: false, status: response.status, body: response.statusText };
      }

      const data = await response.arrayBuffer();
      return { success: true, status: response.status, body: data };
    } catch (error) {
      const message = get(error, 'message', '<unknown>');
      return { success: false, status: 0, body: `Unexpected error: ${message}` };
    }
  }

  public async postJson({ url, headers, body }: T.PostJsonInput): Promise<T.PostJsonOutput> {
    try {
      const response = await fetch(url, { method: 'POST', headers, body });
      if (!response.ok) {
        return { success: false, status: response.status, body: response.statusText };
      }

      const data = await response.json();
      return { success: true, status: response.status, body: data };
    } catch (error) {
      const message = get(error, 'message', '<unknown>');
      return { success: false, status: 0, body: `Unexpected error: ${message}` };
    }
  }
}
