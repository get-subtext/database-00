import type * as T from './OmdbApi.types';

export type ApiMovie = T.Movie;

export interface Movie {
  imdbId: string;
  title: string;
  posterUrl: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTimeMins: number | null;
  plot: string | null;
}

export interface OmdbMapper {
  toMovie: (movie: ApiMovie) => Movie;
}
