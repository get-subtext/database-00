import { createLog } from '../../utils/createLog';
import type { FetchWrapper } from '../fetch/FetchWrapper.types';
import type * as T from './OmdbApi.types';

export class OmdbApi implements T.OmdbApi {
  public constructor(
    private readonly apiKey: string,
    private readonly apiUrlBase: string,
    private readonly fetchWrapper: FetchWrapper
  ) {}

  public async getMovie(imdbId: string): Promise<T.OmdbGetMovieResponse> {
    const url = this.createUrl(imdbId, this.apiKey);
    const { success, status, body: resBody } = await this.fetchWrapper.getJson({ url });

    const logUrl = this.createUrl(imdbId, '<API_KEY>');
    const log = createLog({ input: { url: logUrl }, output: { status, body: resBody } });
    return { success, data: resBody, log };
  }

  private createUrl(imdbId: string, apiKey: string) {
    return `${this.apiUrlBase}/?i=${imdbId}&apikey=${apiKey}`;
  }
}
