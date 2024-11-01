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
    apiKey: string;
    apiUrlBase: string;
  };
  openSubtitles: {
    apiKey: string;
    apiUrlBase: string;
  };
  subdl: {
    apiKey: string;
    apiUrlBase: string;
    zipUrlBase: string;
  };
}

export const createMovieReader = ({ omdb, openSubtitles, subdl }: MovieReaderOptions): MovieReader => {
  const fetchWrapper = new FetchWrapper();
  const omdbApi = new OmdbApi(omdb.apiKey, omdb.apiUrlBase, fetchWrapper);
  const omdbMovieReader = new OmdbMovieReader(omdbApi);
  const openSubtitlesApi = new OpenSubtitlesApi(openSubtitles.apiKey, openSubtitles.apiUrlBase, fetchWrapper);
  const openSubtitlesMovieReader = new OpenSubtitlesMovieReader(openSubtitlesApi);
  const subdlApi = new SubdlApi(subdl.apiKey, subdl.apiUrlBase, subdl.zipUrlBase, fetchWrapper);
  const subdlMovieReader = new SubdlMovieReader(subdl.zipUrlBase, subdlApi);
  return new MovieReaderImpl(omdbMovieReader, openSubtitlesMovieReader, subdlMovieReader);
};
