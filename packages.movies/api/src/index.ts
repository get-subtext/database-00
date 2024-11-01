import type { MovieReader } from './services/movieApi/MovieApi.types';
import { MovieReaderImpl } from './services/movieApi/MovieApiImpl';

export type { Movie, OriginEnum, SourceTypeEnum, SubtitlePackage } from './services/common/Movie.types';
export type { MovieReader, ReadOutput } from './services/movieApi/MovieApi.types';

export interface MovieReaderOptions {}

export const createMovieReader = ({}: MovieReaderOptions): MovieReader => {
  return new MovieReaderImpl();
};
