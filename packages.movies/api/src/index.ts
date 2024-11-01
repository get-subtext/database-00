import { FetchWrapper } from './services/fetch/FetchWrapper';
import { MovieReader as MovieReaderImpl } from './services/movieApi/MovieApi';
import type { MovieReader } from './services/movieApi/MovieApi.types';
import { OmdbApi } from './services/omdb/OmdbApi';
import { OmdbMovieReader } from './services/omdb/OmdbMovieReader';
import { OpenSubtitlesApi } from './services/openSubtitles/OpenSubtitlesApi';
import { OpenSubtitlesMovieReader } from './services/openSubtitles/OpenSubtitlesMovieReader';
import { SubdlApi } from './services/subdl/SubdlApi';
import { SubdlMovieReader } from './services/subdl/SubdlMovieReader';

export type { Movie, OriginEnum, SourceTypeEnum, SubtitlePackage } from './services/common/Movie.types';
export type { MovieReader, ReadOutput } from './services/movieApi/MovieApi.types';

export interface MovieReaderOptions {
  omdb: {
    apiUrlBase: string;
    apiKey: string;
  };
  openSubtitles: {
    apiUrlBase: string;
    apiKey: string;
  };
  subdl: {
    apiUrlBase: string;
    zipUrlBase: string;
    apiKey: string;
  };
}

export const createMovieReader = ({ omdb, openSubtitles, subdl }: MovieReaderOptions): MovieReader => {
  const fetchWrapper = new FetchWrapper();
  const omdbApi = new OmdbApi(omdb.apiUrlBase, omdb.apiKey, fetchWrapper);
  const omdbMovieReader = new OmdbMovieReader(omdbApi);
  const openSubtitlesApi = new OpenSubtitlesApi(openSubtitles.apiUrlBase, openSubtitles.apiKey, fetchWrapper);
  const openSubtitlesMovieReader = new OpenSubtitlesMovieReader(openSubtitlesApi);
  const subdlApi = new SubdlApi(subdl.apiUrlBase, subdl.apiKey, fetchWrapper);
  const subdlMovieReader = new SubdlMovieReader(subdlApi);
  return new MovieReaderImpl(omdbMovieReader, openSubtitlesMovieReader, subdlMovieReader);
};
