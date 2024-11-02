import type { Movie, SubtitlePackage } from '../common/Movie.types';

export interface FmMovie extends Omit<Movie, 'subtitlePackages'> {}
export interface FmSubtitlePackage extends SubtitlePackage {}

export interface FileManager {
  writeMovieData: (movie: FmMovie) => Promise<string>;
  writeSubtitlePackage: (imdbId: string, subtitlePackage: FmSubtitlePackage) => Promise<string>;
}
