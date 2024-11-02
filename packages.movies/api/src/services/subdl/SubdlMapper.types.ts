import type * as T from './SubdlApi.types';

export type ApiMovie = T.Movie;

export interface Subtitle {
  baseUrl: string;
  author: string | null;
}

export interface Movie {
  title: string;
  releaseDate: string | null;
  releaseYear: number | null;
  subtitles: Subtitle[];
}

export interface SubdlMapper {
  toMovie: (movie: ApiMovie) => Movie;
}
