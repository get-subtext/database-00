import { concat } from 'lodash-es';
import { mergeMovies } from '../../utils/mergeMovies';
import { OmdbMovieReader } from '../omdb/OmdbMovieReader';
import { OpenSubtitlesMovieReader } from '../openSubtitles/OpenSubtitlesMovieReader';
import type { SubdlMovieReader } from '../subdl/SubdlMovieReader';
import type * as T from './MovieReader.types';

export class MovieReader implements T.MovieReader {
  public constructor(
    private readonly omdbMovieReader: OmdbMovieReader,
    private readonly openSubtitlesMovieReader: OpenSubtitlesMovieReader,
    private readonly subdlMovieReader: SubdlMovieReader
  ) {}

  public async read(imdbId: string) {
    const readPromises = [this.omdbMovieReader.read(imdbId), this.openSubtitlesMovieReader.read(imdbId), await this.subdlMovieReader.read(imdbId)];
    const [omdbRes, openSubtitlesRes, subdlMovieReader] = await Promise.all(readPromises);

    const success = omdbRes.success || openSubtitlesRes.success || subdlMovieReader.success;
    const logs = concat(omdbRes.logs, openSubtitlesRes.logs, subdlMovieReader.logs);
    if (!success) {
      return { success, data: null, logs };
    }

    const data = mergeMovies([omdbRes.data, openSubtitlesRes.data, subdlMovieReader.data]);
    return { success, data, logs };
  }
}
