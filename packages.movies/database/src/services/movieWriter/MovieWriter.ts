import { Movie } from '../common/Movie.types';
import type { FileManager } from '../fileManager/FileManager.types';
import type * as T from './MovieWriter.types';

export class MovieWriter implements T.MovieWriter {
  public constructor(private readonly fileManager: FileManager) {}

  public async writeMovie(movie: Movie) {
    const { subtitlePackages, ...rest } = movie;
    const filePaths: string[] = [];

    const movieFilePath = await this.fileManager.writeMovieData(rest);
    filePaths.push(movieFilePath);

    for (let i = 0; i < subtitlePackages.length; i++) {
      const subtitlePackage = subtitlePackages[i];
      const subtitlePackagePath = await this.fileManager.writeSubtitlePackage(rest.imdbId, subtitlePackage);
      filePaths.push(subtitlePackagePath);
    }

    return filePaths;
  }
}
