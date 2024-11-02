import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import type * as T from './FileManager.types';

export class FileManager implements T.FileManager {
  public constructor(private readonly dir: string) {}

  public async writeMovie(data: T.FmMovie) {
    const filePath = this.getMovieItemFilePath(data.imdbId);
    await this.writeJsonFile(filePath, data);
    return filePath;
  }

  public async writePoster(imdbId: string, posterUrl: string, posterFileName: string) {
    const filePath = this.getMoviePosterFilePath(imdbId, posterFileName);
    await this.writeImageFile(filePath, posterUrl);
    return filePath;
  }

  public async writeSubtitlePackage(imdbId: string, subtitlePackage: T.FmSubtitlePackage) {
    const filePath = this.getSubtitlePackageItemFilePath(imdbId, subtitlePackage.subtitlePackageId);
    await this.writeJsonFile(filePath, subtitlePackage);
    return filePath;
  }

  public async writeSubtitleText(imdbId: string, subtitlePackageId: string, subtitleFileName: string, subtitles: string) {
    const filePath = this.getSubtitlePackageItemTextPath(imdbId, subtitlePackageId, subtitleFileName);
    await this.writeTextFile(filePath, subtitles);
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
    const subtitlePackageRootDir = path.resolve(movieItemDir, 'subtitle-packages');
    return subtitlePackageRootDir;
  }

  private getSubtitlePackageItemDir(imdbId: string, subtitlePackageId: string) {
    const subtitlePackageRootDir = this.getSubtitlePackageRootDir(imdbId);
    const subtitlePackageItemDir = path.resolve(subtitlePackageRootDir, subtitlePackageId);
    return subtitlePackageItemDir;
  }

  private getMovieItemFilePath(imdbId: string) {
    const movieItemDir = this.getMovieItemDir(imdbId);
    const filePath = path.resolve(movieItemDir, 'index.json');
    return filePath;
  }

  private getMoviePosterFilePath(imdbId: string, fileName: string) {
    const movieItemDir = this.getMovieItemDir(imdbId);
    const filePath = path.resolve(movieItemDir, fileName);
    return filePath;
  }

  private getSubtitlePackageItemFilePath(imdbId: string, subtitlePackageId: string) {
    const subtitlesDir = this.getSubtitlePackageItemDir(imdbId, subtitlePackageId);
    const subtitlePackageItemFilePath = path.resolve(subtitlesDir, 'index.json');
    return subtitlePackageItemFilePath;
  }

  private getSubtitlePackageItemTextPath(imdbId: string, subtitlePackageId: string, fileName: string) {
    const subtitlesDir = this.getSubtitlePackageItemDir(imdbId, subtitlePackageId);
    const subtitlePackageItemFilePath = path.resolve(subtitlesDir, fileName);
    return subtitlePackageItemFilePath;
  }

  private async writeJsonFile(filePath: string, fileContent: any) {
    this.ensureDir(filePath);
    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));
  }

  private async writeTextFile(filePath: string, fileContent: string) {
    this.ensureDir(filePath);
    fs.writeFileSync(filePath, fileContent);
  }

  private async writeImageFile(filePath: string, url: string) {
    this.ensureDir(filePath);
    const response = await fetch(url);
    const fileStream = fs.createWriteStream(filePath);
    await promisify(pipeline)(response.body as unknown as NodeJS.ReadableStream, fileStream);
  }

  private ensureDir(filePath: string) {
    fs.mkdirSync(path.resolve(filePath, '..'), { recursive: true });
  }
}
