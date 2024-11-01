import { Movie } from '../common/Movie.types';

export const defaultMovie = (): Movie => ({
  imdbId: 'Unknown',
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
});
