import { FetchLog } from '../common/FetchLog.types';
import { Movie } from '../common/Movie.types';

export interface ReadOutputOk {
  success: true;
  logs: FetchLog[];
  data: Movie;
}

export interface ReadOutputFail {
  success: false;
  logs: FetchLog[];
  data: null;
}

export type ReadOutput = ReadOutputOk | ReadOutputFail;

export interface MovieReader {
  read: (imdbId: string) => Promise<ReadOutput>;
}
