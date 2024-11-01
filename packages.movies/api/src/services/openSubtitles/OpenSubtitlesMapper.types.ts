import type * as T from './OpenSubtitlesApi.types';

export type ApiSubtitlesPage = T.SubtitlesPage;
export type ApiSubtitles = T.Subtitles;
export type ApiRelatedLink = T.RelatedLink;

export interface File {
  id: number;
  name: string;
}

export interface SubtitlePackage {
  title: string | null;
  releaseYear: number | null;
  posterUrl: string | null;
  author: string | null;
  files: File[];
}

export interface ToSubtitlePackagePage {
  totalPages: number;
  subtitlePackages: SubtitlePackage[];
}

export interface OpenSubtitlesMapper {
  toSubtitlePackagePage: (movie: ApiSubtitlesPage) => ToSubtitlePackagePage;
}
