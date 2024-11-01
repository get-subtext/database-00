import { createLog } from '../../utils/createLog';
import type { FetchWrapper } from '../fetch/FetchWrapper.types';
import type * as T from './OmdbApi.types';

export class OmdbApi implements T.OmdbApi {
  public constructor(
    private readonly apiKey: string,
    private readonly apiUrlBase: string,
    private readonly fetchWrapper: FetchWrapper
  ) {}

  public async getMovieInfo(imdbId: string): Promise<T.GetMovieInfoOutput> {
    const url = this.createMovieInfoUrl(imdbId, this.apiKey);
    const { success, status, body: resBody } = await this.fetchWrapper.getJson({ url });

    const logUrl = this.createMovieInfoUrl(imdbId, '<API_KEY>');
    const log = createLog({ input: { url: logUrl }, output: { status, body: resBody } });
    return { success, data: resBody, log };
  }

  private createMovieInfoUrl(imdbId: string, apiKey: string) {
    return `${this.apiUrlBase}/?i=${imdbId}&apikey=${apiKey}`;
  }
}
