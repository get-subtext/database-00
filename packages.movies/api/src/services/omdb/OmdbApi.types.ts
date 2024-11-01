import { FetchLog } from '../common/FetchLog.types';

export interface SearchOutputDataRating {
  Source: string;
  Value: string;
}

export interface SearchOutputData {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: SearchOutputDataRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface SearchOutput {
  success: boolean;
  logs: FetchLog[];
  data: SearchOutputData | null;
}

export interface OmdbApi {
  search: () => Promise<SearchOutput>;
}
