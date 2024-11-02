import type { Movie } from '../common/Movie.types';

export interface FmMovie extends Omit<Movie, 'subtitlePackages'> {}

export interface FileManager {
  writeMovieData: (data: FmMovie) => Promise<string>;
}
