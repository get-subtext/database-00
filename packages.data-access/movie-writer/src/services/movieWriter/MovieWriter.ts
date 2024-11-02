import { map, uniq } from 'lodash-es';
import path from 'path';
import { Movie } from '../common/Movie.types';
import type { FileManager } from '../fileManager/FileManager.types';
import type * as T from './MovieWriter.types';

const subtitleFileName = 'subtitles.txt';

export class MovieWriter implements T.MovieWriter {
  public constructor(private readonly fileManager: FileManager) {}

  public async writeMovie(movie: Movie) {
    const { subtitlePackages, posterUrl, ...rest } = movie;
    const filePaths: string[] = [];

    const posterFileName = this.getPosterFileName(posterUrl);
    const subtitlePackageIds = uniq(map(subtitlePackages, (s) => s.subtitlePackageId));
    const fmMovie = { ...rest, posterFileName, subtitlePackageIds };
    const movieFilePath = await this.fileManager.writeMovie(fmMovie);
    filePaths.push(movieFilePath);

    if (posterUrl !== null && posterFileName !== null) {
      const posterFilePath = await this.fileManager.writePoster(movie.imdbId, posterUrl, posterFileName);
      filePaths.push(posterFilePath);
    }

    for (let i = 0; i < subtitlePackages.length; i++) {
      const { subtitles, ...subtitlePackage } = subtitlePackages[i];
      const fmSubtitlePackage = { ...subtitlePackage, subtitleFileName };

      const subtitlePackagePath = await this.fileManager.writeSubtitlePackage(rest.imdbId, fmSubtitlePackage);
      filePaths.push(subtitlePackagePath);

      const subtitleTextPath = await this.fileManager.writeSubtitleText(rest.imdbId, fmSubtitlePackage.subtitlePackageId, subtitleFileName, subtitles);
      filePaths.push(subtitleTextPath);
    }

    return filePaths;
  }

  private getPosterFileName(posterUrl: string | null) {
    if (posterUrl === null) return null;
    const ext = path.parse(path.basename(posterUrl)).ext;
    return `poster${ext}`;
  }
}
