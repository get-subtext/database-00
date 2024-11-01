import type { FetchWrapper } from '../fetch/FetchWrapper.types';
import type * as T from './SubdlApi.types';

export class SubdlApi implements T.SubdlApi {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly apiKey: string,
    private readonly fetchWrapper: FetchWrapper
  ) {}

  public async getMovieInfo(imdbId: string): Promise<T.GetMovieInfoOutput> {
    const url = `${this.apiUrlBase}?imdb_id=${imdbId}&type=movie&languages=EN&api_key=${this.apiKey}`;
    const fetchRes = await this.fetchWrapper.getJson({ url });

    const logUrl = `${this.apiUrlBase}?imdb_id=${imdbId}&type=movie&languages=EN&api_key=<API_KEY>`;
    const logText = fetchRes.success ? JSON.stringify(fetchRes.body) : fetchRes.body;
    const log = { input: { url: logUrl, method: 'GET', body: null, headers: {} }, output: { status: fetchRes.status, text: logText } };
    return { success: fetchRes.success, data: fetchRes.body, logs: [log] };
  }

  public async getZipFile(url: string): Promise<T.GetMovieInfoOutput> {
    const fetchRes = await this.fetchWrapper.fetch({ url });

    const logText = fetchRes.success ? JSON.stringify(fetchRes.body) : fetchRes.body;
    const log = { input: { url, method: 'GET', body: null, headers: {} }, output: { status: fetchRes.status, text: logText } };
    return { success: fetchRes.success, data: fetchRes.body, logs: [log] };
  }
}
