import { OmdbMovieReader } from '../omdb/OmdbMovieReader';
import { OpenSubtitlesMovieReader } from '../openSubtitles/OpenSubtitlesMovieReader';
import type * as T from './MovieApi.types';

export class MovieReader implements T.MovieReader {
  public constructor(
    private readonly omdbMovieReader: OmdbMovieReader,
    private readonly openSubtitlesMovieReader: OpenSubtitlesMovieReader
  ) {}

  public async read(imdbId: string) {
    const omdbRes = await this.omdbMovieReader.read(imdbId);
    const openSubtitlesRes = await this.openSubtitlesMovieReader.read(imdbId);
    return await this.omdbMovieReader.read(imdbId);
  }
}
