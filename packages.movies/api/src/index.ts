import { FetchWrapper } from './services/fetch/FetchWrapper';
import { MovieReader as MovieReaderImpl } from './services/movieReader/MovieReader';
import type { MovieReader } from './services/movieReader/MovieReader.types';
import { OmdbApi } from './services/omdb/OmdbApi';
import { OmdbMapper } from './services/omdb/OmdbMapper';
import { OmdbMovieReader } from './services/omdb/OmdbMovieReader';
import { OpenSubtitlesApi } from './services/openSubtitles/OpenSubtitlesApi';
import { OpenSubtitlesMapper } from './services/openSubtitles/OpenSubtitlesMapper';
import { OpenSubtitlesMovieReader } from './services/openSubtitles/OpenSubtitlesMovieReader';
import { SubdlApi } from './services/subdl/SubdlApi';
import { SubdlMapper } from './services/subdl/SubdlMapper';
import { SubdlMovieReader } from './services/subdl/SubdlMovieReader';

export { OriginEnum, SourceTypeEnum } from './services/common/Movie.types';
export type { Movie, SubtitlePackage } from './services/common/Movie.types';
export type { MovieReader, ReadMovieResponse as ReadOutput } from './services/movieReader/MovieReader.types';

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
  const omdbMapper = new OmdbMapper();
  const omdbMovieReader = new OmdbMovieReader(omdbApi, omdbMapper);
  const openSubtitlesApi = new OpenSubtitlesApi(openSubtitles.apiKey, openSubtitles.apiUrlBase, fetchWrapper);
  const openSubtitlesMapper = new OpenSubtitlesMapper();
  const openSubtitlesMovieReader = new OpenSubtitlesMovieReader(openSubtitlesApi, openSubtitlesMapper);
  const subdlApi = new SubdlApi(subdl.apiKey, subdl.apiUrlBase, subdl.zipUrlBase, fetchWrapper);
  const subdlMapper = new SubdlMapper();
  const subdlMovieReader = new SubdlMovieReader(subdl.zipUrlBase, subdlApi, subdlMapper);
  return new MovieReaderImpl(omdbMovieReader, openSubtitlesMovieReader, subdlMovieReader);
};
