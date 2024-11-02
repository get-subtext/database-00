import { createLog } from '../../utils/createLog';
import type { FetchWrapper } from '../fetch/FetchWrapper.types';
import type * as T from './OpenSubtitlesApi.types';

export class OpenSubtitlesApi implements T.OpenSubtitlesApi {
  public constructor(
    private readonly apiKey: string,
    private readonly apiUrlBase: string,
    private readonly fetchWrapper: FetchWrapper
  ) {}

  public async getMoviePage(imdbId: string, page: number): Promise<T.OsGetMoviePageResponse> {
    const url = `${this.apiUrlBase}/subtitles?imdb_id=${imdbId}&page=${page}`;
    const headers = this.createHeaders(this.apiKey);
    const { success, status, body: resBody } = await this.fetchWrapper.getJson({ url, headers });
    const logHeaders = this.createHeaders('<API_KEY>');
    const log = createLog({ input: { url, headers: logHeaders }, output: { status, body: resBody } });
    return { success, data: resBody, log };
  }

  public async getDownloadMeta(fileId: number): Promise<T.OsGetDownloadMetaResponse> {
    const reqBody = { file_id: fileId, sub_format: 'srt' };

    const url = `${this.apiUrlBase}/download`;
    const headers = this.createHeaders(this.apiKey);
    const { success, status, body: resBody } = await this.fetchWrapper.postJson({ url, headers, body: reqBody });

    const logHeaders = this.createHeaders('<API_KEY>');
    const log = createLog({ input: { url, headers: logHeaders, body: reqBody }, output: { status, body: resBody } });
    return { success, data: resBody, log };
  }

  public async downloadTextFile(url: string): Promise<T.OsDownloadTextFileResponse> {
    const { success, status, body: resBody } = await this.fetchWrapper.getText({ url });
    const log = createLog({ input: { url, method: 'POST' }, output: { status, body: resBody } });
    return { success, data: <any>resBody, log };
  }

  private createHeaders(apiKey: string) {
    return { Accept: 'application/json', Authorization: `Bearer ${apiKey}`, 'Api-Key': apiKey, 'Content-Type': 'application/json', 'User-Agent': 'subtext v0' };
  }
}
