import { get } from 'lodash-es';
import type * as T from './FetchWrapper.types';
import { DataTypeEnum } from './FetchWrapper.types';

export class FetchWrapper implements T.FetchWrapper {
  public async fetch({ url, method, headers, body, dataType }: T.FetchWrapperInput): Promise<T.FetchWrapperOutput> {
    try {
      const response = await fetch(url, { method, headers, body });
      if (response.ok) {
        const data = dataType === DataTypeEnum.Text ? await response.text() : await response.json();
        return { success: true, status: response.status, body: data };
      } else {
        return { success: false, status: response.status, body: null };
      }
    } catch (error) {
      const message = get(error, 'message', '<unknown>');
      return { success: false, status: 0, body: `Unexpected error: ${message}` };
    }
  }

  public async getText({ url, headers }: T.GetTextInput): Promise<T.GetTextOutput> {
    try {
      const response = await fetch(url, { headers });
      if (response.ok) {
        const data = await response.text();
        return { success: true, status: response.status, body: data };
      } else {
        return { success: false, status: response.status, body: null };
      }
    } catch (error) {
      const message = get(error, 'message', '<unknown>');
      return { success: false, status: 0, body: `Unexpected error: ${message}` };
    }
  }

  public async getJson({ url, headers }: T.GetJsonInput): Promise<T.GetJsonOutput> {
    try {
      const response = await fetch(url, { headers });
      if (response.ok) {
        const data = await response.json();
        return { success: true, status: response.status, body: data };
      } else {
        return { success: false, status: response.status, body: null };
      }
    } catch (error) {
      const message = get(error, 'message', '<unknown>');
      return { success: false, status: 0, body: `Unexpected error: ${message}` };
    }
  }

  public async postJson({ url, headers, body }: T.PostJsonInput): Promise<T.PostJsonOutput> {
    try {
      const response = await fetch(url, { method: 'POST', headers, body });
      if (response.ok) {
        const data = await response.json();
        return { success: true, status: response.status, body: data };
      } else {
        return { success: false, status: response.status, body: null };
      }
    } catch (error) {
      const message = get(error, 'message', '<unknown>');
      return { success: false, status: 0, body: `Unexpected error: ${message}` };
    }
  }
}
