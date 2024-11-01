import { FetchLog } from '../common/FetchLog.types';
import { Movie } from '../common/Movie.types';

export interface ReadMovieResponseOk {
  success: true;
  logs: FetchLog[];
  data: Movie;
}

export interface ReadMovieResponseFail {
  success: false;
  logs: FetchLog[];
  data: null;
}

export type ReadMovieResponse = ReadMovieResponseOk | ReadMovieResponseFail;

export interface ExtractZipResponseOk {
  success: true;
  data: Record<string, string>;
  message: null;
}

export interface ExtractZipResponseFail {
  success: false;
  data: null;
  message: string;
}

export type ExtractZipResponse = ExtractZipResponseOk | ExtractZipResponseFail;

export interface MovieReader {
  read: (imdbId: string) => Promise<ReadMovieResponse>;
}
