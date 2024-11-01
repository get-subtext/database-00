import type { MovieReader } from './services/movieApi/MovieApi.types';
import { MovieReaderImpl } from './services/movieApi/MovieApiImpl';
import { OmdbApi } from './services/omdb/OmdbApi';
import { OmdbMovieReader } from './services/omdb/OmdbMovieReader';

export type { Movie, OriginEnum, SourceTypeEnum, SubtitlePackage } from './services/common/Movie.types';
export type { MovieReader, ReadOutput } from './services/movieApi/MovieApi.types';

export interface MovieReaderOptions {
  omdb: {
    apiUrlBase: string;
    apiKey: string;
  };
}

export const createMovieReader = ({ omdb }: MovieReaderOptions): MovieReader => {
  const omdbApi = new OmdbApi(omdb.apiUrlBase, omdb.apiKey);
  const omdbMovieReader = new OmdbMovieReader(omdbApi);
  return new MovieReaderImpl(omdbMovieReader);
};
