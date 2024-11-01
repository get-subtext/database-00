import type { FetchWrapper } from '../fetch/FetchWrapper.types';
import type * as T from './OpenSubtitlesApi.types';

export class OmdbApi implements T.OmdbApi {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly apiKey: string,
    private readonly fetchWrapper: FetchWrapper
  ) {}

  public async getMovieInfo(imdbId: string): Promise<T.GetMovieInfoOutput> {
    const logUrl = `${this.apiUrlBase}/subtitles?imdb_id=${imdbId}`;
    const logHeaders = { Accept: 'application/json', 'Api-Key': '<API_KEY>', 'Content-Type': 'application/json', 'User-Agent': 'subtext v0' };
    const log = { input: { url: logUrl, method: 'GET', body: null, headers: logHeaders }, output: { status: 0, text: '' } };

    const url = `${this.apiUrlBase}/subtitles?imdb_id=${imdbId}`;
    const headers = { Accept: 'application/json', 'Api-Key': this.apiKey, 'Content-Type': 'application/json', 'User-Agent': 'subtext v0' };
    const fetchRes = await this.fetchWrapper.fetch({ url, headers });
    log.output.status = fetchRes.status;
    log.output.text = fetchRes.success ? JSON.stringify(fetchRes.body) : fetchRes.body;
    return { success: fetchRes.success, data: fetchRes.body, logs: [log] };
  }

  public async getDownloadInfo(fileId: number): Promise<T.GetDownloadInfoOutput> {
    const body = { file_id: fileId, sub_format: 'srt' };

    const logUrl = `${this.apiUrlBase}/download`;
    const logHeaders = { Accept: 'application/json', 'Api-Key': '<API_KEY>', 'Content-Type': 'application/json', 'User-Agent': 'subtext v0' };
    const log = { input: { url: logUrl, method: 'GET', body, headers: logHeaders }, output: { status: 0, text: '' } };

    const url = `${this.apiUrlBase}/download`;
    const headers = { Accept: 'application/json', 'Api-Key': this.apiKey, 'Content-Type': 'application/json', 'User-Agent': 'subtext v0' };
    const fetchRes = await this.fetchWrapper.fetch({ url, headers });
    log.output.status = fetchRes.status;
    log.output.text = fetchRes.success ? JSON.stringify(fetchRes.body) : fetchRes.body;
    return { success: fetchRes.success, data: fetchRes.body, logs: [log] };
  }

  public async getFile(url: string): Promise<T.GetFileOutput> {
    const logUrl = url;
    const log = { input: { url: logUrl, method: 'GET', body: null, headers: {} }, output: { status: 0, text: '' } };

    const fetchRes = await this.fetchWrapper.fetch({ url });
    log.output.status = fetchRes.status;
    log.output.text = fetchRes.body;
    return { success: fetchRes.success, data: fetchRes.body, logs: [log] };
  }
}
