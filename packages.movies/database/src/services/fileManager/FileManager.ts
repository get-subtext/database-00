import fs from 'fs';
import path from 'path';
import type * as T from './FileManager.types';

export class FileManager implements T.FileManager {
  public constructor(private readonly dir: string) {}

  public async writeMovieData(data: T.FmMovie) {
    const filePath = this.getMovieItemFilePath(data.imdbId);
    await this.writeJsonFile(filePath, data);
    return filePath;
  }

  public async writeSubtitlePackage(imdbId: string, subtitlePackage: T.FmSubtitlePackage) {
    const filePath = this.getSubtitlePackageItemFilePath(imdbId, subtitlePackage.subtitlePackageId);
    await this.writeJsonFile(filePath, subtitlePackage);
    return filePath;
  }

  private getMovieRootDir() {
    const movieRootDir = path.resolve(this.dir, 'movies');
    return movieRootDir;
  }

  private getMovieItemDir(imdbId: string) {
    const movieRootDir = this.getMovieRootDir();
    const movieItemDir = path.resolve(movieRootDir, imdbId);
    return movieItemDir;
  }

  private getSubtitlePackageRootDir(imdbId: string) {
    const movieItemDir = this.getMovieItemDir(imdbId);
    const subtitlePackageRootDir = path.resolve(movieItemDir, 'subtitles');
    return subtitlePackageRootDir;
  }

  private getSubtitlePackageItemDir(imdbId: string, subtitlePackageId: string) {
    const subtitlePackageRootDir = this.getSubtitlePackageRootDir(imdbId);
    const subtitlePackageItemDir = path.resolve(subtitlePackageRootDir, 'subtitles', subtitlePackageId);
    return subtitlePackageItemDir;
  }

  private getMovieItemFilePath(imdbId: string) {
    const movieItemDir = this.getMovieItemDir(imdbId);
    const filePath = path.resolve(movieItemDir, 'index.json');
    return filePath;
  }

  private getSubtitlePackageItemFilePath(imdbId: string, subtitlePackageId: string) {
    const subtitlesDir = this.getSubtitlePackageItemDir(imdbId, subtitlePackageId);
    const subtitlePackageItemFilePath = path.resolve(subtitlesDir, 'index.json');
    return subtitlePackageItemFilePath;
  }

  private async writeJsonFile(filePath: string, fileContent: any) {
    this.ensureDir(filePath);
    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));
  }

  private ensureDir(filePath: string) {
    fs.mkdirSync(path.resolve(filePath, '..'), { recursive: true });
  }
}
