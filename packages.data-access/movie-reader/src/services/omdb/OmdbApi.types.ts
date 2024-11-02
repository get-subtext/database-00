import type { FetchLog } from '../common/FetchLog.types';

export interface OmdbRating {
  Source: string;
  Value: string;
}

export interface OmdbMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: OmdbRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface OmdbGetMovieResponseOk {
  success: true;
  log: FetchLog;
  data: OmdbMovie;
}

export interface OmdbGetMovieResponseFail {
  success: false;
  log: FetchLog;
  data: null;
}

export type OmdbGetMovieResponse = OmdbGetMovieResponseOk | OmdbGetMovieResponseFail;

export interface OmdbApi {
  getMovie: (imdbId: string) => Promise<OmdbGetMovieResponse>;
}
