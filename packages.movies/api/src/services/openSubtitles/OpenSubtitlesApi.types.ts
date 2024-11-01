import { FetchLog } from '../common/FetchLog.types';

export interface SearchOutputDataDataAttributesFile {
  file_id: number;
  cd_number: number;
  file_name: string;
}

export interface SearchOutputDataDataAttributesRelatedLink {
  label: string;
  url: string;
  img_url: string;
}

export interface SearchOutputDataDataAttributesFeatureDetails {
  feature_id: number;
  feature_type: string;
  year: number;
  title: string;
  movie_name: string;
  imdb_id: number;
  tmdb_id: number;
}

export interface SearchOutputDataDataAttributesUploader {
  uploader_id: null;
  name: string;
  rank: string;
}

export interface SearchOutputDataDataAttributes {
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
  uploader: SearchOutputDataDataAttributesUploader;
  feature_details: SearchOutputDataDataAttributesFeatureDetails;
  url: string;
  related_links: SearchOutputDataDataAttributesRelatedLink[];
  files: SearchOutputDataDataAttributesFile[];
}

export interface GetMovieInfoOutputDataData {
  id: string;
  type: string;
  attributes: SearchOutputDataDataAttributes;
}

export interface GetMovieInfoOutputData {
  total_pages: number;
  total_count: number;
  per_page: number;
  page: number;
  data: GetMovieInfoOutputDataData[];
}

export interface GetMovieInfoOutput {
  success: boolean;
  logs: FetchLog[];
  data: GetMovieInfoOutputData | null;
}

export interface GetDownloadInfoOutputData {
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

export interface GetDownloadInfoOutput {
  success: boolean;
  logs: FetchLog[];
  data: GetDownloadInfoOutputData | null;
}

export interface GetFileOutput {
  success: boolean;
  logs: FetchLog[];
  data: string | null;
}

export interface OpenSubtitlesApi {
  getMovieInfo: (imdbId: string) => Promise<GetMovieInfoOutput>;
  getDownloadInfo: (fileId: number) => Promise<GetDownloadInfoOutput>;
  getFile: (url: string) => Promise<GetFileOutput>;
}
