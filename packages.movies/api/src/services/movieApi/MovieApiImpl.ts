import { OmdbMovieReader } from '../omdb/OmdbMovieReader';
import type { MovieReader } from './MovieApi.types';

export class MovieReaderImpl implements MovieReader {
  public constructor(private readonly omdbMovieReader: OmdbMovieReader) {}

  public async read(imdbId: string) {
    return await this.omdbMovieReader.read(imdbId);
  }
}
