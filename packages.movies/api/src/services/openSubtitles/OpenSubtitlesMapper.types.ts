import type * as T from './OpenSubtitlesApi.types';

export type OsApiSubtitlesPage = T.OsMoviePage;
export type OsApiMovie = T.OsMovie;
export type OsApiRelatedLink = T.OsRelatedLink;

export interface OsMappedFile {
  id: number;
  name: string;
}

export interface OsMappedMovie {
  title: string | null;
  releaseYear: number | null;
  posterUrl: string | null;
  author: string | null;
  files: OsMappedFile[];
}

export interface OsMappedMoviePage {
  totalPages: number;
  movie: OsMappedMovie[];
}

export interface OpenSubtitlesMapper {
  toMoviePage: (movie: OsApiSubtitlesPage) => OsMappedMoviePage;
}
