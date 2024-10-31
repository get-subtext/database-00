import type { MovieReader } from './services/MovieApi.types';
import { MovieReaderImpl } from './services/MovieApiImpl';

export type { Movie, OriginEnum, SourceTypeEnum, SubtitlePackage } from './services/Common.types';
export type { MovieReader, ReadOutput } from './services/MovieApi.types';

export interface MovieReaderOptions {}

export const createMovieReader = ({}: MovieReaderOptions): MovieReader => {
  return new MovieReaderImpl();
};
