import type * as T from './SubdlApi.types';

export type SubdlApiMovie = T.SubdlMovie;

export interface SubdlMappedSubtitle {
  baseUrl: string;
  author: string | null;
}

export interface SubdlMappedMovie {
  title: string;
  releaseDate: string | null;
  releaseYear: number | null;
  subtitles: SubdlMappedSubtitle[];
}

export interface SubdlMapper {
  toMovie: (movie: SubdlApiMovie) => SubdlMappedMovie;
}
