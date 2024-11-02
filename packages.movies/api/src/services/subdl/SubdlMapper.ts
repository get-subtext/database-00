import { map } from 'lodash-es';
import type * as T from './SubdlMapper.types';

export class SubdlMapper implements T.SubdlMapper {
  public constructor() {}

  public toMovie(movie: T.ApiMovie): T.Movie {
    const meta = this.getMeta(movie);

    return {
      title: meta.title!,
      releaseDate: meta.releaseDate,
      releaseYear: meta.releaseYear,
      subtitles: map(movie.subtitles, (s) => ({ baseUrl: s.url, author: s.author })),
    };
  }

  private getMeta(movie: T.ApiMovie) {
    type TOutput = { title: string | null; releaseDate: string | null; releaseYear: number | null };
    const output: TOutput = { title: 'Unknown', releaseDate: null, releaseYear: null };

    // Assuming results is an array for TV episodes?
    // Let's iterate and get the data, with first element taking priority.
    for (let i = 0; i < movie.results.length; i++) {
      const result = movie.results[i];
      output.title = output.title === 'Unknown' ? result.name : 'Unknown';
      output.releaseDate = output.releaseDate ?? result.release_date ?? null;
      output.releaseYear = output.releaseYear ?? result.year ?? null;
    }

    return output;
  }
}
