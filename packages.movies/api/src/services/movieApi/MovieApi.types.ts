import { Movie } from '../common/Movie.types';

export interface ReadOutput extends Movie {}

export interface MovieReader {
  read: (imdbId: string) => Promise<ReadOutput>;
}
