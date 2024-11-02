import type { FileManager } from '../fileManager/FileManager.types';
import type * as T from './MovieWriter.types';

export class MovieWriter implements T.MovieWriter {
  public constructor(private readonly fileManager: FileManager) {}
}
