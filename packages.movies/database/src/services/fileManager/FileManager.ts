import fs from 'fs';
import path from 'path';
import type * as T from './FileManager.types';

export class FileManager implements T.FileManager {
  public constructor(private readonly dir: string) {}

  public async writeMovieData(data: T.FmMovie) {
    const filePath = this.getMovieDataFilePath(data.imdbId);
    await this.writeJsonFile(filePath, data);
    return filePath;
  }

  private getMovieRootDir() {
    const filePath = path.resolve(this.dir, 'movies');
    return filePath;
  }

  private getMovieItemDir(imdbId: string) {
    const movieRootDir = this.getMovieRootDir();
    const movieDir = path.resolve(movieRootDir, imdbId);
    return movieDir;
  }

  private getMovieDataFilePath(imdbId: string) {
    const movieItemDir = this.getMovieItemDir(imdbId);
    const filePath = path.resolve(movieItemDir, 'index.json');
    return filePath;
  }

  private async writeJsonFile(filePath: string, fileContent: any) {
    this.ensureDir(filePath);
    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));
  }

  private ensureDir(filePath: string) {
    fs.mkdirSync(path.resolve(filePath, '..'), { recursive: true });
  }
}
