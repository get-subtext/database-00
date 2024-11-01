import { concat } from 'lodash-es';
import { OmdbMovieReader } from '../omdb/OmdbMovieReader';
import { OpenSubtitlesMovieReader } from '../openSubtitles/OpenSubtitlesMovieReader';
import type { SubdlMovieReader } from '../subdl/SubdlMovieReader';
import { mergeMovies } from '../utils/mergeMovies';
import type * as T from './MovieApi.types';

export class MovieReader implements T.MovieReader {
  public constructor(
    private readonly omdbMovieReader: OmdbMovieReader,
    private readonly openSubtitlesMovieReader: OpenSubtitlesMovieReader,
    private readonly subdlMovieReader: SubdlMovieReader
  ) {}

  public async read(imdbId: string) {
    const omdbRes = await this.omdbMovieReader.read(imdbId);
    const openSubtitlesRes = await this.openSubtitlesMovieReader.read(imdbId);
    const subdlMovieReader = await this.subdlMovieReader.read(imdbId);

    const success = omdbRes.success || openSubtitlesRes.success || subdlMovieReader.success;
    const logs = concat(omdbRes.logs, openSubtitlesRes.logs, subdlMovieReader.logs);
    if (success) {
      const data = mergeMovies([omdbRes.data, openSubtitlesRes.data, subdlMovieReader.data]);
      return { success, data, logs };
    } else {
      return { success, data: null, logs };
    }
  }
}
