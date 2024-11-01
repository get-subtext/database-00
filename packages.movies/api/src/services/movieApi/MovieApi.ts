import { concat } from 'lodash-es';
import { OmdbMovieReader } from '../omdb/OmdbMovieReader';
import { OpenSubtitlesMovieReader } from '../openSubtitles/OpenSubtitlesMovieReader';
import { mergeMovie } from '../utils/mergeMovie';
import type * as T from './MovieApi.types';

export class MovieReader implements T.MovieReader {
  public constructor(
    private readonly omdbMovieReader: OmdbMovieReader,
    private readonly openSubtitlesMovieReader: OpenSubtitlesMovieReader
  ) {}

  public async read(imdbId: string) {
    const omdbRes = await this.omdbMovieReader.read(imdbId);
    const openSubtitlesRes = await this.openSubtitlesMovieReader.read(imdbId);

    const success = omdbRes.success || openSubtitlesRes.success;
    const logs = concat(omdbRes.logs, openSubtitlesRes.logs);
    if (success) {
      const data = mergeMovie(omdbRes.data, openSubtitlesRes.data);
      return { success, data, logs };
    } else {
      return { success, data: null, logs };
    }
  }
}
