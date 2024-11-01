import { concat, isNil, uniq } from 'lodash-es';
import { Movie } from '../common/Movie.types';
import { defaultMovie } from './defaultMovie';

export const mergeMovie = (movie1: Movie | null, movie2: Movie | null): Movie => {
  const m1 = isNil(movie1) ? defaultMovie() : movie1;
  const m2 = isNil(movie2) ? defaultMovie() : movie2;
  return {
    imdbId: m1.imdbId === 'Unknown' ? m2.imdbId : m1.imdbId,
    title: m1.title === 'Unknown' ? m2.title : m1.title,
    posterUrl: isNil(m1.posterUrl) ? m2.posterUrl : m1.posterUrl,
    releaseDate: isNil(m1.releaseDate) ? m2.releaseDate : m1.releaseDate,
    releaseYear: isNil(m1.releaseYear) ? m2.releaseYear : m1.releaseYear,
    rated: isNil(m1.rated) ? m2.rated : m1.rated,
    genres: uniq(concat(m1.genres, m2.genres)),
    directors: uniq(concat(m1.directors, m2.directors)),
    writers: uniq(concat(m1.writers, m2.writers)),
    actors: uniq(concat(m1.actors, m2.actors)),
    runTimeMins: isNil(m1.runTimeMins) ? m2.runTimeMins : m1.runTimeMins,
    plot: isNil(m1.plot) ? m2.plot : m1.plot,
    subtitlePackages: concat(m1.subtitlePackages, m2.subtitlePackages),
  };
};
