import { Movie } from '../common/Movie.types';
import { MovieReader } from '../movieApi/MovieApi.types';
import { OpenSubtitlesApi } from './OpenSubtitlesApi';

export class OpenSubtitlesMovieReader implements MovieReader {
  public constructor(private readonly omdbApi: OpenSubtitlesApi) {}

  public async read(imdbId: string) {
    const searchRes = await this.omdbApi.getMovieInfo(imdbId);
    if (!searchRes.success) return { success: false, data: null, logs: searchRes.logs };

    const data = searchRes.data!;
    const movie: Movie = {
      imdbId,
      title: 'Unknown',
      posterUrl: null,
      releaseDate: null,
      releaseYear: null,
      rated: null,
      genres: [],
      directors: [],
      writers: [],
      actors: [],
      runTimeMins: null,
      plot: null,
      subtitlePackages: [],
    };

    return { success: false, data: movie, logs: searchRes.logs };
  }
}
