import type { Movie } from '../common/Movie.types';
import type * as T from '../movieApi/MovieApi.types';
import type { OmdbApi } from './OmdbApi.types';
import type { OmdbMapper } from './OmdbMapper.types';

export class OmdbMovieReader implements T.MovieReader {
  public constructor(
    private readonly omdbApi: OmdbApi,
    private readonly omdbMapper: OmdbMapper
  ) {}

  public async read(imdbId: string): Promise<T.ReadOutput> {
    const getMovieInfoRes = await this.omdbApi.getMovieInfo(imdbId);
    if (getMovieInfoRes.success) {
      const data = this.omdbMapper.mapMovie(getMovieInfoRes.data);
      const movie: Movie = {
        imdbId,
        title: data.title,
        posterUrl: data.posterUrl,
        releaseDate: data.releaseDate,
        releaseYear: data.releaseYear,
        rated: data.rated,
        genres: data.genres,
        directors: data.directors,
        writers: data.writers,
        actors: data.actors,
        runTimeMins: data.runTimeMins,
        plot: data.plot,
        subtitlePackages: [],
      };

      return { success: true, data: movie, logs: [getMovieInfoRes.log] };
    } else {
      return { success: false, data: null, logs: [getMovieInfoRes.log] };
    }
  }
}
