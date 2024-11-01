import type * as T from './OmdbApi.types';

export type ApiMovieRating = T.GetMovieInfoOutputDataRating;
export type ApiMovie = T.GetMovieInfoOutputData;

export interface MapMovieOutput {
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
  mapMovie: (movie: ApiMovie) => MapMovieOutput;
}
