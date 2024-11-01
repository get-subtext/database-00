import type { FetchLog } from '../common/FetchLog.types';

export interface File {
  file_id: number;
  cd_number: number;
  file_name: string;
}

export interface RelatedLink {
  label: string;
  url: string;
  img_url: string;
}

export interface FeatureDetails {
  feature_id: number;
  feature_type: string;
  year: number;
  title: string;
  movie_name: string;
  imdb_id: number;
  tmdb_id: number;
}

export interface Uploader {
  uploader_id: null;
  name: string;
  rank: string;
}

export interface Attributes {
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
  uploader: Uploader;
  feature_details: FeatureDetails;
  url: string;
  related_links: RelatedLink[];
  files: File[];
}

export interface Subtitles {
  id: string;
  type: string;
  attributes: Attributes;
}

export interface SubtitlesPage {
  total_pages: number;
  total_count: number;
  per_page: number;
  page: number;
  data: Subtitles[];
}

export interface GetSubtitlesPageResponseOk {
  success: true;
  data: SubtitlesPage;
  log: FetchLog;
}

export interface GetSubtitlesPageResponseFail {
  success: false;
  data: null;
  log: FetchLog;
}

export type GetSubtitlesPageResponse = GetSubtitlesPageResponseOk | GetSubtitlesPageResponseFail;

export interface DownloadMeta {
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

export interface GetDownloadMetaResponseOk {
  success: true;
  log: FetchLog;
  data: DownloadMeta;
}

export interface GetDownloadMetaResponseFail {
  success: false;
  log: FetchLog;
  data: null;
}

export type GetDownloadMetaResponse = GetDownloadMetaResponseOk | GetDownloadMetaResponseFail;

export interface DownloadTextFileResponseOk {
  success: true;
  log: FetchLog;
  data: string;
}

export interface DownloadTextFileResponseFail {
  success: false;
  log: FetchLog;
  data: null;
}

export type DownloadTextFileResponse = DownloadTextFileResponseOk | DownloadTextFileResponseFail;

export interface OpenSubtitlesApi {
  getSubtitlesPage: (imdbId: string, pageNumber: number) => Promise<GetSubtitlesPageResponse>;
  getDownloadMeta: (fileId: number) => Promise<GetDownloadMetaResponse>;
  downloadTextFile: (url: string) => Promise<DownloadTextFileResponse>;
}
