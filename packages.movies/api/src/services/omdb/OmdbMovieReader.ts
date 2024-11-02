import type { Movie } from '../common/Movie.types';
import type * as T from '../movieReader/MovieReader.types';
import type { OmdbApi } from './OmdbApi.types';
import type { OmdbMapper } from './OmdbMapper.types';

export class OmdbMovieReader implements T.MovieReader {
  public constructor(
    private readonly omdbApi: OmdbApi,
    private readonly omdbMapper: OmdbMapper
  ) {}

  public async read(imdbId: string): Promise<T.ReadMovieResponse> {
    const getMovieInfoRes = await this.omdbApi.getMovie(imdbId);
    if (!getMovieInfoRes.success) {
      return { success: false, data: null, logs: [getMovieInfoRes.log] };
    }

    const movieRaw = this.omdbMapper.toMovie(getMovieInfoRes.data);
    const movie: Movie = {
      imdbId,
      title: movieRaw.title,
      posterUrl: movieRaw.posterUrl,
      releaseDate: movieRaw.releaseDate,
      releaseYear: movieRaw.releaseYear,
      rated: movieRaw.rated,
      genres: movieRaw.genres,
      directors: movieRaw.directors,
      writers: movieRaw.writers,
      actors: movieRaw.actors,
      runTimeMins: movieRaw.runTimeMins,
      plot: movieRaw.plot,
      subtitlePackages: [],
    };

    return { success: true, data: movie, logs: [getMovieInfoRes.log] };
  }
}
