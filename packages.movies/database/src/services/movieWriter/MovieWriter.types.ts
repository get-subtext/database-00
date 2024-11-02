import { Movie } from '../common/Movie.types';

export interface MovieWriter {
  writeMovie: (movie: Movie) => Promise<string[]>;
}
