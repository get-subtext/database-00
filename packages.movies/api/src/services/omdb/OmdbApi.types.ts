import type { FetchLog } from '../common/FetchLog.types';

export interface Rating {
  Source: string;
  Value: string;
}

export interface Movie {
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
  Ratings: Rating[];
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

export interface GetMovieInfoResponseOk {
  success: true;
  log: FetchLog;
  data: Movie;
}

export interface GetMovieInfoResponseFail {
  success: false;
  log: FetchLog;
  data: null;
}

export type GetMovieInfoResponse = GetMovieInfoResponseOk | GetMovieInfoResponseFail;

export interface OmdbApi {
  getMovieInfo: (imdbId: string) => Promise<GetMovieInfoResponse>;
}
