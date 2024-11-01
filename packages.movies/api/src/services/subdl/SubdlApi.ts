import type { FetchWrapper } from '../fetch/FetchWrapper.types';
import { createLog } from '../utils/createLog';
import type * as T from './SubdlApi.types';

export class SubdlApi implements T.SubdlApi {
  public constructor(
    private readonly apiKey: string,
    private readonly apiUrlBase: string,
    private readonly subdlZipUrlBase: string,
    private readonly fetchWrapper: FetchWrapper
  ) {}

  public async getMovieInfo(imdbId: string): Promise<T.GetMovieInfoOutput> {
    const url = this.createMovieInfoUrl(imdbId, this.apiKey);
    const { success, status, body } = await this.fetchWrapper.getJson({ url });

    const logUrl = this.createMovieInfoUrl(imdbId, '<API_KEY>');
    const log = createLog({ input: { url: logUrl }, output: { status, body } });
    return { success, data: body, log };
  }

  public async getZipFile(urlPath: string): Promise<T.GetZipFileOutput> {
    const url = `${this.subdlZipUrlBase}${urlPath}`;
    const { success, status, body } = await this.fetchWrapper.getFile({ url });

    const log = createLog({ input: { url }, output: { status, body: success ? '<ArrayBuffer>' : null } });
    return success ? { success, data: body, log } : { success, data: null, log };
  }

  private createMovieInfoUrl(imdbId: string, apiKey: string) {
    return `${this.apiUrlBase}?imdb_id=${imdbId}&type=movie&languages=EN&api_key=${apiKey}`;
  }
}
