import { endsWith, map, parseInt, split, trim } from 'lodash-es';
import type * as T from './OmdbMapper.types';

export class OmdbMapper implements T.OmdbMapper {
  public constructor() {}

  public toMovie(movie: T.ApiMovie): T.Movie {
    return {
      imdbId: movie.imdbID,
      title: movie.Title,
      posterUrl: this.parseText(movie.Poster),
      releaseDate: this.parseReleaseDate(movie.Released),
      releaseYear: this.parseReleaseYear(movie.Year),
      rated: this.parseText(movie.Rated),
      genres: this.parseTextArray(movie.Genre),
      directors: this.parseTextArray(movie.Director),
      writers: this.parseTextArray(movie.Writer),
      actors: this.parseTextArray(movie.Actors),
      runTimeMins: this.parseRunTime(movie.Runtime),
      plot: this.parseText(movie.Plot),
    };
  }

  private parseText(text: string) {
    // The API seems to return "N/A" in a lot of places, so guard this
    return text === 'N/A' ? null : text;
  }

  private parseTextArray(text: string) {
    // The API seems to return "N/A" in a lot of places, so guard this
    return text === 'N/A' ? [] : map(split(text, ','), (g) => trim(g));
  }

  private parseReleaseDate(date: string) {
    try {
      return new Date(Date.parse(`${date} UTC`)).toISOString();
    } catch {
      return null;
    }
  }

  private parseReleaseYear(year: string) {
    try {
      return parseInt(year, 10);
    } catch {
      return null;
    }
  }

  private parseRunTime(runTime: string) {
    try {
      if (!endsWith(runTime, 'min')) return null;
      return parseInt(runTime, 10);
    } catch {
      return null;
    }
  }
}
