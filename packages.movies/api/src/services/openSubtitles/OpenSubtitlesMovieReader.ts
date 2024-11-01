import { endsWith, map, parseInt, split, trim } from 'lodash-es';
import { Movie } from '../common/Movie.types';
import { MovieReader } from '../movieApi/MovieApi.types';
import { OmdbApi } from './OpenSubtitlesApi';

export class OmdbMovieReader implements MovieReader {
  public constructor(private readonly omdbApi: OmdbApi) {}

  public async read(imdbId: string) {
    const searchRes = await this.omdbApi.getMovieInfo(imdbId);
    if (!searchRes.success) return { success: false, data: null, logs: searchRes.logs };

    const data = searchRes.data!;
    const movie: Movie = {
      imdbId,
      title: data.Title,
      posterUrl: this.parseText(data.Poster),
      releaseDate: this.parseReleaseDate(data.Released),
      releaseYear: this.parseReleaseYear(data.Year),
      rated: this.parseText(data.Rated),
      genres: this.parseTextArray(data.Genre),
      directors: this.parseTextArray(data.Director),
      writers: this.parseTextArray(data.Writer),
      actors: this.parseTextArray(data.Actors),
      runTimeMins: this.parseRunTime(data.Runtime),
      plot: this.parseText(data.Plot),
      subtitlePackages: [],
    };

    return { success: false, data: movie, logs: searchRes.logs };
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
