import { Movie } from './Common.types';

export interface ReadOutput extends Movie {}

export interface MovieReader {
  read: (imdbId: string) => Promise<Movie>;
}
