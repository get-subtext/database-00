import type * as T from './OpenSubtitlesApi.types';

export type ApiSubtitlesPage = T.MoviePage;
export type ApiMovie = T.Movie;
export type ApiRelatedLink = T.RelatedLink;

export interface File {
  id: number;
  name: string;
}

export interface Movie {
  title: string | null;
  releaseYear: number | null;
  posterUrl: string | null;
  author: string | null;
  files: File[];
}

export interface MoviePage {
  totalPages: number;
  movie: Movie[];
}

export interface OpenSubtitlesMapper {
  toMoviePage: (movie: ApiSubtitlesPage) => MoviePage;
}
