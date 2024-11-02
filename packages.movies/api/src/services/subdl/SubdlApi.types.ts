import type { FetchLog } from '../common/FetchLog.types';

export interface SubdlResult {
  sd_id: number;
  type: string;
  name: string;
  imdb_id: string;
  tmdb_id: number;
  first_air_date: string;
  release_date: string;
  year: number;
}

export interface SubdlSubtitle {
  release_name: string;
  name: string;
  lang: string;
  author: string;
  url: string;
  subtitlePage: string;
  season: number | null;
  episode: number | null;
  language: string;
  hi: boolean;
  episode_from: number | null;
  episode_end: number | number;
  full_season: boolean;
}

export interface SubdlMovie {
  status: boolean;
  results: SubdlResult[];
  subtitles: SubdlSubtitle[];
}

export interface SubdlGetMovieResponseOk {
  success: true;
  log: FetchLog;
  data: SubdlMovie;
}

export interface SubdlGetMovieResponseFail {
  success: false;
  log: FetchLog;
  data: null;
}

export type SubdlGetMovieResponse = SubdlGetMovieResponseOk | SubdlGetMovieResponseFail;

export interface SubdlDownloadZipFileResponseOk {
  success: true;
  log: FetchLog;
  data: ArrayBuffer;
}

export interface SubdlDownloadZipFileResponseFail {
  success: false;
  log: FetchLog;
  data: null;
}

export type SubdlDownloadZipFileResponse = SubdlDownloadZipFileResponseOk | SubdlDownloadZipFileResponseFail;

export interface SubdlApi {
  getMovie: (imdbId: string) => Promise<SubdlGetMovieResponse>;
  downloadZipFile: (url: string) => Promise<SubdlDownloadZipFileResponse>;
}
