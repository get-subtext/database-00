import { FetchLog } from '../common/FetchLog.types';
import { Movie } from '../common/Movie.types';

export interface ReadOutput {
  success: boolean;
  logs: FetchLog[];
  data: Movie | null;
}

export interface MovieReader {
  read: (imdbId: string) => Promise<ReadOutput>;
}
