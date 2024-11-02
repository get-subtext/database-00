import type { Movie, SubtitlePackage } from '../common/Movie.types';

export interface FmMovie extends Omit<Movie, 'posterUrl' | 'subtitlePackages'> {
  posterFileName: string | null;
  subtitlePackageIds: string[];
}

export interface FmSubtitlePackage extends Omit<SubtitlePackage, 'subtitles'> {
  subtitleFileName: string;
}

export interface FileManager {
  writeMovie: (movie: FmMovie) => Promise<string>;
  writePoster: (imdbId: string, posterUrl: string, posterFileName: string) => Promise<string>;
  writeSubtitlePackage: (imdbId: string, subtitlePackage: FmSubtitlePackage) => Promise<string>;
  writeSubtitleText: (imdbId: string, subtitlePackageId: string, subtitleFileName: string, subtitles: string) => Promise<string>;
}
