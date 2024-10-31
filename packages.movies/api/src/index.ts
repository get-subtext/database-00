import type { MovieReader } from './services/MovieApi.types';
import { MovieReaderImpl } from './services/MovieApiImpl';

export type { MovieReader } from './services/MovieApi.types';

export interface MovieReaderOptions {}

export const createMovieReader = ({}: MovieReaderOptions): MovieReader => {
  return new MovieReaderImpl();
};
