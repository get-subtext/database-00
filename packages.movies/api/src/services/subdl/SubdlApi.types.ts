import type { FetchLog } from '../common/FetchLog.types';

export interface Result {
  sd_id: number;
  type: string;
  name: string;
  imdb_id: string;
  tmdb_id: number;
  first_air_date: string;
  release_date: string;
  year: number;
}

export interface Subtitle {
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

export interface Movie {
  status: boolean;
  results: Result[];
  subtitles: Subtitle[];
}

export interface GetSubtitlesResponseOk {
  success: true;
  log: FetchLog;
  data: Movie;
}

export interface GetSubtitlesResponseFail {
  success: false;
  log: FetchLog;
  data: null;
}

export type GetMovieInfoResponse = GetSubtitlesResponseOk | GetSubtitlesResponseFail;

export interface DownloadZipFileResponseOk {
  success: true;
  log: FetchLog;
  data: ArrayBuffer;
}

export interface DownloadZipFileResponseFail {
  success: false;
  log: FetchLog;
  data: null;
}

export type DownloadZipFileResponse = DownloadZipFileResponseOk | DownloadZipFileResponseFail;

export interface SubdlApi {
  getMovieInfo: (imdbId: string) => Promise<GetMovieInfoResponse>;
  downloadZipFile: (url: string) => Promise<DownloadZipFileResponse>;
}
