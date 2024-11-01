import { get } from 'lodash-es';
import type * as T from './OmdbApi.types';

export class OmdbApi {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly apiKey: string
  ) {}

  public async search(imdbId: string): Promise<T.SearchOutput> {
    const logUrl = `${this.apiUrlBase}/?i=${imdbId}&apikey=<API_KEY>`;
    const log = { input: { url: logUrl, body: null, headers: {} }, output: { status: 0, text: '' } };

    try {
      const url = `${this.apiUrlBase}/?i=${imdbId}&apikey=${this.apiKey}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = (await response.json()) as T.SearchOutputData;
        log.output = { status: response.status, text: JSON.stringify(data) };
        return { success: true, data, logs: [log] };
      } else {
        log.output = { status: response.status, text: await response.text() };
        return { success: false, data: null, logs: [log] };
      }
    } catch (error) {
      const message = get(error, 'message', '<unknown>');
      log.output = { status: 0, text: `Unexpected error: ${message}` };
      return { success: false, data: null, logs: [log] };
    }
  }
}
