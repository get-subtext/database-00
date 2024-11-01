import { FetchLog } from '../common/FetchLog.types';

export interface GetMovieInfoOutputDataResult {
  sd_id: number;
  type: string;
  name: string;
  imdb_id: string;
  tmdb_id: number;
  first_air_date: string;
  release_date: string;
  year: number;
}

export interface GetMovieInfoOutputDataSubtitle {
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

export interface GetMovieInfoOutputData {
  status: boolean;
  results: GetMovieInfoOutputDataResult[];
  subtitles: GetMovieInfoOutputDataSubtitle[];
}

export interface GetMovieInfoOutput {
  success: boolean;
  logs: FetchLog[];
  data: GetMovieInfoOutputData | null;
}

export interface SubdlApi {
  getMovieInfo: (imdbId: string) => Promise<GetMovieInfoOutput>;
}
