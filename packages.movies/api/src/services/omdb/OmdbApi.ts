import type { FetchWrapper } from '../fetch/FetchWrapper.types';
import type * as T from './OmdbApi.types';

export class OmdbApi implements T.OmdbApi {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly apiKey: string,
    private readonly fetchWrapper: FetchWrapper
  ) {}

  public async getMovieInfo(imdbId: string): Promise<T.SearchOutput> {
    const logUrl = `${this.apiUrlBase}/?i=${imdbId}&apikey=<API_KEY>`;
    const log = { input: { url: logUrl, method: 'GET', body: null, headers: {} }, output: { status: 0, text: '' } };

    const url = `${this.apiUrlBase}/?i=${imdbId}&apikey=${this.apiKey}`;
    const fetchRes = await this.fetchWrapper.fetch({ url });
    log.output.status = fetchRes.status;
    log.output.text = fetchRes.success ? JSON.stringify(fetchRes.body) : fetchRes.body;
    return { success: fetchRes.success, data: fetchRes.body, logs: [log] };
  }
}
