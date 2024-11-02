import { createLog } from '../../utils/createLog';
import type { FetchWrapper } from '../fetch/FetchWrapper.types';
import type * as T from './SubdlApi.types';

export class SubdlApi implements T.SubdlApi {
  public constructor(
    private readonly apiKey: string,
    private readonly apiUrlBase: string,
    private readonly subdlZipUrlBase: string,
    private readonly fetchWrapper: FetchWrapper
  ) {}

  public async getMovie(imdbId: string): Promise<T.GetMovieResponse> {
    const url = this.createUrl(imdbId, this.apiKey);
    const { success, status, body: resBody } = await this.fetchWrapper.getJson({ url });

    const logUrl = this.createUrl(imdbId, '<API_KEY>');
    const log = createLog({ input: { url: logUrl }, output: { status, body: resBody } });
    return { success, data: resBody, log };
  }

  public async downloadZipFile(urlPath: string): Promise<T.DownloadZipFileResponse> {
    const url = `${this.subdlZipUrlBase}${urlPath}`;
    const { success, status, body: resBody } = await this.fetchWrapper.getFile({ url });

    const log = createLog({ input: { url }, output: { status, body: success ? '<ArrayBuffer>' : null } });
    return success ? { success, data: resBody, log } : { success, data: null, log };
  }

  private createUrl(imdbId: string, apiKey: string) {
    return `${this.apiUrlBase}?imdb_id=${imdbId}&type=movie&languages=EN&api_key=${apiKey}`;
  }
}
