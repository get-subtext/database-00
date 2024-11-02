import type { FetchLog } from '../common/FetchLog.types';

export interface OsFile {
  file_id: number;
  cd_number: number;
  file_name: string;
}

export interface OsRelatedLink {
  label: string;
  url: string;
  img_url: string;
}

export interface OsFeatureDetails {
  feature_id: number;
  feature_type: string;
  year: number;
  title: string;
  movie_name: string;
  imdb_id: number;
  tmdb_id: number;
}

export interface OsUploader {
  uploader_id: null;
  name: string;
  rank: string;
}

export interface OsAttributes {
  subtitle_id: string;
  language: string;
  download_count: number;
  new_download_count: number;
  hearing_impaired: boolean;
  hd: boolean;
  fps: number;
  votes: number;
  ratings: number;
  from_trusted: boolean;
  foreign_parts_only: boolean;
  upload_date: string;
  file_hashes: [];
  ai_translated: boolean;
  nb_cd: number;
  slug: string;
  machine_translated: boolean;
  release: string;
  comments: string;
  legacy_subtitle_id: number;
  legacy_uploader_id: number;
  uploader: OsUploader;
  feature_details: OsFeatureDetails;
  url: string;
  related_links: OsRelatedLink[];
  files: OsFile[];
}

export interface OsMovie {
  id: string;
  type: string;
  attributes: OsAttributes;
}

export interface OsMoviePage {
  total_pages: number;
  total_count: number;
  per_page: number;
  page: number;
  data: OsMovie[];
}

export interface OsGetMoviePageResponseOk {
  success: true;
  data: OsMoviePage;
  log: FetchLog;
}

export interface OsGetMoviePageResponseFail {
  success: false;
  data: null;
  log: FetchLog;
}

export type OsGetMoviePageResponse = OsGetMoviePageResponseOk | OsGetMoviePageResponseFail;

export interface OsDownloadMeta {
  link: string;
  file_name: string;
  requests: number;
  remaining: number;
  message: string;
  reset_time: string;
  reset_time_utc: string;
  uk: string;
  uid: number;
  ts: number;
}

export interface OsGetDownloadMetaResponseOk {
  success: true;
  log: FetchLog;
  data: OsDownloadMeta;
}

export interface OsGetDownloadMetaResponseFail {
  success: false;
  log: FetchLog;
  data: null;
}

export type OsGetDownloadMetaResponse = OsGetDownloadMetaResponseOk | OsGetDownloadMetaResponseFail;

export interface OsDownloadTextFileResponseOk {
  success: true;
  log: FetchLog;
  data: string;
}

export interface OsDownloadTextFileResponseFail {
  success: false;
  log: FetchLog;
  data: null;
}

export type OsDownloadTextFileResponse = OsDownloadTextFileResponseOk | OsDownloadTextFileResponseFail;

export interface OpenSubtitlesApi {
  getMoviePage: (imdbId: string, pageNumber: number) => Promise<OsGetMoviePageResponse>;
  getDownloadMeta: (fileId: number) => Promise<OsGetDownloadMetaResponse>;
  downloadTextFile: (url: string) => Promise<OsDownloadTextFileResponse>;
}
