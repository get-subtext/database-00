import type { FetchLog } from '../common/FetchLog.types';

export interface GetMovieInfoOutputDataRating {
  Source: string;
  Value: string;
}

export interface GetMovieInfoOutputData {
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
  Ratings: GetMovieInfoOutputDataRating[];
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

export interface GetMovieInfoOutputOk {
  success: true;
  log: FetchLog;
  data: GetMovieInfoOutputData;
}

export interface GetMovieInfoOutputFail {
  success: false;
  log: FetchLog;
  data: null;
}

export type GetMovieInfoOutput = GetMovieInfoOutputOk | GetMovieInfoOutputFail;

export interface OmdbApi {
  getMovieInfo: (imdbId: string) => Promise<GetMovieInfoOutput>;
}
