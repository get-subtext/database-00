import { concat, isNil, uniq } from 'lodash-es';
import { Movie } from '../common/Movie.types';
import { defaultMovie } from './defaultMovie';

export const mergeMovies = (movies: (Movie | null)[]): Movie => {
  return movies.reduce<Movie>((accumulator, movie) => {
    const m = isNil(movie) ? defaultMovie() : movie;
    return {
      imdbId: accumulator.imdbId === 'Unknown' ? m.imdbId : accumulator.imdbId,
      title: accumulator.title === 'Unknown' ? m.title : accumulator.title,
      posterUrl: isNil(accumulator.posterUrl) ? m.posterUrl : accumulator.posterUrl,
      releaseDate: isNil(accumulator.releaseDate) ? m.releaseDate : accumulator.releaseDate,
      releaseYear: isNil(accumulator.releaseYear) ? m.releaseYear : accumulator.releaseYear,
      rated: isNil(accumulator.rated) ? m.rated : accumulator.rated,
      genres: uniq(concat(accumulator.genres, m.genres)),
      directors: uniq(concat(accumulator.directors, m.directors)),
      writers: uniq(concat(accumulator.writers, m.writers)),
      actors: uniq(concat(accumulator.actors, m.actors)),
      runTimeMins: isNil(accumulator.runTimeMins) ? m.runTimeMins : accumulator.runTimeMins,
      plot: isNil(accumulator.plot) ? m.plot : accumulator.plot,
      subtitlePackages: concat(accumulator.subtitlePackages, m.subtitlePackages),
    };
  }, defaultMovie());
};
